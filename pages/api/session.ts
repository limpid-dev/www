import { withIronSessionApiRoute } from 'iron-session/next'
// if (req.nextUrl.pathname.startsWith('/api/session') && req.method === 'POST') {

import { NextApiRequest, NextApiResponse } from "next";
import { ironSessionConfig } from '../../iron-session-config';


//     const url = req.url.match(/\/api\/(.*)/)![1]

//     const response = await fetch(new URL(url,process.env.NEXT_PUBLIC_API_URL), {
//       method: req.method,
//       headers: {
//         ...req.headers,
//       },
//       credentials: "include",
//       body: await req.blob()
//     });


//     const data = await response.json();

//     const session = await getIronSession(req, NextResponse.next(), ironSessionConfig);


//     console.log(data)

//     session.token = data.data.token 

//     await session.save()

//     return NextResponse.json(data, {
//       headers: {
//         ...response.headers,
//       }
//       , status: response.status,
//       url: response.url
//     })

//     }

//     if (req.nextUrl.pathname.startsWith('/api/session') && req.method === 'DELETE') {

//       const url = req.url.match(/\/api\/(.*)/)![1]

//       const response = await fetch(new URL(url,process.env.NEXT_PUBLIC_API_URL), {
//         method: req.method,
//         headers: {
//           ...req.headers,
//         },
//         credentials: "include",
//         body: await req.blob()
//       });


//       const data = await response.json();

//       const session = await getIronSession(req, NextResponse.next(), ironSessionConfig);

//       await session.destroy()

//       return NextResponse.json(data, {
//         headers: {
//           ...response.headers,
//         }
//         , status: response.status,
//         url: response.url
//       })

//       }

export default withIronSessionApiRoute(
    async function authRoute(req, res) {
      if(req.method==='POST'){
        
        const response = await fetch(new URL('session',process.env.NEXT_PUBLIC_API_URL), {
            method: req.method,
            credentials: "include",
            headers:{
                'Content-Type': 'application/json',
              ...(req.session.token ? {'Authorization': `Bearer ${req.session.token}`} : { })

            },
            body: JSON.stringify(req.body),
        })

        const bod = await response.json()

        if(response.ok){
            req.session.token = bod.data.token

            await req.session.save()
            
        }
return          res.status(response.status).json(bod)


      }
      if(req.method==='DELETE'){
        const response = await fetch(new URL('session',process.env.NEXT_PUBLIC_API_URL), {
            method: req.method,
            headers: {
              'Authorization': `Bearer ${req.session.token}`
            },
            credentials: "include",
          });
        
          if(response.ok){
                        req.session.destroy()
          }

         return  res.status(response.status).end()
      }
    },
    ironSessionConfig
  );