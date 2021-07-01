import jwt from 'next-auth/jwt';

export default async (req, res) => {
  const token = await jwt.getToken({
    req,
    secret: null,
  });
  console.log('JSON Web Token', token);
  res.end();
};
