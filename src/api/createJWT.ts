const jwt = require('jsonwebtoken');
require('dotenv').config();

export type CreateJWTResponse = {
  accessToken: any
  error: boolean
}

exports.createToken = function (fn: any, ln: any, id: any) {
  return _createToken( fn, ln, id );
}

let _createToken = function (fn: any, ln: any, id: any): CreateJWTResponse {
    var ret;
    try {
      const expiration: Date = new Date();
      const user = {userId:id,firstName:fn,lastName:ln};

      //const accessToken =  jwt.sign( user, process.env.ACCESS_TOKEN_SECRET);

      // In order to exoire with a value other than the default, use the 
       // following
      
      const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, 
         { expiresIn: '30m'} );
                    //   '24h'
                    //  '365d'
      
      ret = {accessToken: accessToken, error: false};
    }
    catch(e)
    {
        console.log(e)
      ret = {accessToken: null, error: true};
    }
    return ret;
}

exports.isExpired = function( token: any )
{
   var isError = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, 
     (err: any, verifiedJwt: any) =>
   {
     if( err )
     {
       return true;
     }
     else
     {
       return false;
     }
   });

   return isError;

}

exports.refresh = function( token: any )
{
  var ud = jwt.decode(token,{complete:true});

  var userId = ud.payload.id;
  var firstName = ud.payload.firstName;
  var lastName = ud.payload.lastName;

  return _createToken( firstName, lastName, userId );
}
