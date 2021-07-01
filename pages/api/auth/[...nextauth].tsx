import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { login } from "~/services/auth";
var FormData = require("form-data");
// .env.local.example variable
//
// NEXTAUTH_URL=http://localhost:3000
// NEXTAUTH_TWITTER_ID=
// NEXTAUTH_TWITTER_SECRET=
// NEXTAUTH_GITHUB_ID=
// NEXTAUTH_GITHUB_SECRET=
// NEXTAUTH_GOOGLE_ID=
// NEXTAUTH_GOOGLE_SECRET=
// NEXTAUTH_FACEBOOK_ID=
// NEXTAUTH_FACEBOOK_SECRET=
// NEXTAUTH_EMAIL_SERVER=smtp://username:password@smtp.example.com:587
// NEXTAUTH_EMAIL_FROM=NextAuth <noreply@example.com>
// NEXTAUTH_DATABASE_URL=sqlite://localhost/:memory:?synchronize=true

const options = {
  // @link https://next-auth.js.org/configuration/providers

  providers: [
    Providers.Credentials({
      id: "credentials-signin",
      name: "Tài khoản",
      // credentials: {
      //   username: {
      //     label: 'username',
      //     type: 'text',
      //     placeholder: 'truongthuc',
      //   },
      //   password: { label: 'password', type: 'password' },
      // },
      authorize: async (credentials: any) => {
        console.log("DATA LOGIN: ", credentials);

        // sample code
        // const user = (credentials) => {
        //   // You need to provide your own logic here that takes the credentials
        //   // submitted and returns either a object representing a user or value
        //   // that is false/null if the credentials are invalid.

        //   return { id: 1, name: 'J Smith', email: 'jsmith@example.com' };
        //   // return { credentials: credentials };
        // };
        // if (user) {
        //   // Any user object returned here will be saved in the JSON Web Token
        //   return Promise.resolve(user);
        // } else {
        //   // If you return null or false then the credentials will be rejected
        //   return Promise.resolve(null);
        //   // You can also Reject this callback with an Error or with a URL:
        //   // return Promise.reject(new Error('error message')) // Redirect to error page
        //   // return Promise.reject('/path/to/redirect')        // Redirect to a URL
        // }

        try {
          const rs = await login(credentials);

          // console.log("CAN I SEE RS: ", rs);

          return Promise.resolve(rs.data);
        } catch (error) {
          // return Promise.reject(new Error(JSON.stringify(error)));
          return Promise.reject(
            new Error(encodeURIComponent(JSON.stringify(error)))
          );
        }
      },
    }),
    // Providers.Email({
    //   // SMTP connection string or nodemailer configuration object https://nodemailer.com/
    //   server: process.env.NEXTAUTH_EMAIL_SERVER,
    //   // Email services often only allow sending email from a valid/verified address
    //   from: process.env.NEXTAUTH_EMAIL_FROM,
    // }),
    // // When configuring oAuth providers make sure you enabling requesting
    // // permission to get the users email address (required to sign in)
    // Providers.Google({
    //   clientId: process.env.NEXTAUTH_GOOGLE_ID,
    //   clientSecret: process.env.NEXTAUTH_GOOGLE_SECRET,
    // }),
    // Providers.Facebook({
    //   clientId: process.env.NEXTAUTH_FACEBOOK_ID,
    //   clientSecret: process.env.NEXTAUTH_FACEBOOK_SECRET,
    // }),
    // Providers.Twitter({
    //   clientId: process.env.NEXTAUTH_TWITTER_ID,
    //   clientSecret: process.env.NEXTAUTH_TWITTER_SECRET,
    // }),
    // Providers.GitHub({
    //   clientId: process.env.NEXTAUTH_GITHUB_ID,
    //   clientSecret: process.env.NEXTAUTH_GITHUB_SECRET,
    // }),
  ],

  // @link https://next-auth.js.org/configuration/databases
  // Optional SQL or MongoDB database to persist users
  // database: process.env.NEXTAUTH_DATABASE_URL,

  // @link https://next-auth.js.org/configuration/options#session
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,
    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // @link https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation - you should set this explicitly
    // Defaults to NextAuth.js secret if not explicitly specified.
    secret:
      "YzQzYzg0MzljNzE5ODk0ZDQwZGQ0NGNhOGI5MmU4OThlNmVlODZlYTc0M2Y5MjFjNDdmYWI2ZmJmZjFjNjBjMQ==",
    // Set to true to use encryption. Defaults to false (signing only).
    encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // @link https://next-auth.js.org/configuration/callbacks
  callbacks: {
    /**
     * Intercept signIn request and return true if the user is allowed.
     *
     * @link https://next-auth.js.org/configuration/callbacks#sign-in-callback
     * @param  {object} user     User object
     * @param  {object} account  Provider account
     * @param  {object} profile  Provider profile
     * @return {boolean}         Return `true` (or a modified JWT) to allow sign in
     *                           Return `false` to deny access
     */
    signIn: async (user, account, profile) => {
      // console.log('signIn callbacks', user, account, profile)
      return Promise.resolve(true);
    },

    /**
     * @link https://next-auth.js.org/configuration/callbacks#session-callback
     * @param  {object} session      Session object
     * @param  {object} user         User object    (if using database sessions)
     *                               JSON Web Token (if not using database sessions)
     * @return {object}              Session that will be returned to the client
     */
    session: async (session, token) => {
      //session.customSessionProperty = 'bar'
      // console.log("session callback", session, token);
      if (token.data) {
        session.accessToken = token.data.Token;
        session.user = { ...token.data };
      }

      console.log("Session user: ", session.user);
      console.log("Session token: ", session.accessToken);

      return Promise.resolve(session);
    },

    /**
     * @link https://next-auth.js.org/configuration/callbacks#jwt-callback
     * @param  {object}  token     Decrypted JSON Web Token
     * @param  {object}  user      User object      (only available on sign in)
     * @param  {object}  account   Provider account (only available on sign in)
     * @param  {object}  profile   Provider profile (only available on sign in)
     * @param  {boolean} isNewUser True if new user (only available on sign in)
     * @return {object}            JSON Web Token that will be saved
     */
    jwt: async (token, user, account, profile, isNewUser) => {
      // user = token?.data;
      // token = token?.data.Token;

      console.log("jwt callbacks:");
      console.log("token", token);
      console.log("user", user);
      console.log("account", account);
      console.log("profile", profile);
      console.log("isNewUser", isNewUser);

      const isSignIn = user ? true : false;
      // Add auth_time to token on signin in
      if (isSignIn) {
        token.auth_time = Math.floor(Date.now() / 1000);
      }
      if (account?.type === "credentials") {
        const newToken = {
          ...token,
          ...user,
          isNewUser,
        };
        return Promise.resolve(newToken);
      }

      return Promise.resolve(token);
    },
    /**
     * @param  {string} url      URL provided as callback URL by the client
     * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
     * @return {string}          URL the client will be redirect to
     */
    redirect: async (url, baseUrl) => {
      console.log("redirect callback", url, baseUrl);
      return url.startsWith(baseUrl)
        ? Promise.resolve(url)
        : Promise.resolve(baseUrl);
    },
  },

  //Events are asynchronous functions that do not return a response, they are useful for audit logs / reporting.
  // You can specify a handler for any of these events below, for debugging or for an audit log.
  // @link https://next-auth.js.org/configuration/events
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
    },
  },

  // You can define custom pages to override the built-in pages
  // The routes shown here are the default URLs that will be used.
  // @link https://next-auth.js.org/configuration/pages
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/signin", // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: null, // If set, new users will be directed here on first sign in
  },

  // Additional options
  // secret: 'abcdef123456789' // Recommended (but auto-generated if not specified)
  debug: true, // Use this option to enable debug messages in the console
};

const Auth = (req, res) => NextAuth(req, res, options);

export default Auth;
