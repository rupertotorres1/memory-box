import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  secret: process.env.SECRET,

  // Enable debug messages in the console if you are having problems
  debug: false,
};

export default (req, res) => NextAuth(req, res, options);
