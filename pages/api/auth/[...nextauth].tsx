import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { SocialLogin, login } from '~/services/auth';

const options = {
	providers: [
		Providers.Credentials({
			id: 'credentials-signin',
			name: 'Tài khoản',
			authorize: async (credentials: any) => {
				console.log('DATA LOGIN: ', credentials);
				try {
					const rs: any = credentials?.isSocial ? await SocialLogin(credentials) : await login(credentials);
					return credentials?.isSocial ? Promise.resolve(rs) : Promise.resolve(rs.data);
				} catch (error) {
					return Promise.reject(new Error(encodeURIComponent(JSON.stringify(error))));
				}
			}
		})
	],

	session: {
		jwt: true
	},

	jwt: {
		secret: 'YzQzYzg0MzljNzE5ODk0ZDQwZGQ0NGNhOGI5MmU4OThlNmVlODZlYTc0M2Y5MjFjNDdmYWI2ZmJmZjFjNjBjMQ==',
		encryption: true
	},

	callbacks: {
		signIn: async (user, account, profile) => {
			return Promise.resolve(true);
		},
		session: async (session, token) => {
			if (token) {
				session.accessToken = token.token;
				session.user = { ...token.data };
			}
			console.log('Session user: ', session.user);
			console.log('Session token: ', session.accessToken);
			return Promise.resolve(session);
		},
		jwt: async (token, user, account, profile, isNewUser) => {
			console.log('jwt callbacks:');
			console.log('token', token);
			console.log('user', user);
			console.log('account', account);
			console.log('profile', profile);
			console.log('isNewUser', isNewUser);
			const isSignIn = user ? true : false;
			if (isSignIn) {
				token.auth_time = Math.floor(Date.now() / 1000);
			}
			if (account?.type === 'credentials') {
				const newToken = {
					...token,
					...user,
					isNewUser
				};
				return Promise.resolve(newToken);
			}
			return Promise.resolve(token);
		},
		redirect: async (url, baseUrl) => {
			console.log('redirect callback', url, baseUrl);
			return url.startsWith(baseUrl) ? Promise.resolve(url) : Promise.resolve(baseUrl);
		}
	},

	events: {
		async signIn(message) {
			/* on successful sign in */
		},
		async signOut(message) {
			/* on signout */
		},
		async createUser(message) {
			/* user created */
		},
		async linkAccount(message) {
			/* account linked to a user */
		},
		async session(message) {
			/* session is active */
		},
		async error(message) {
			/* error in authentication flow */
		}
	},

	pages: {
		signIn: '/auth/signin',
		signOut: '/auth/signout',
		error: '/auth/signin', // Error code passed in query string as ?error=
		newUser: null // If set, new users will be directed here on first sign in
	},

	debug: true // Use this option to enable debug messages in the console
};

const Auth = (req, res) => NextAuth(req, res, options);

export default Auth;
