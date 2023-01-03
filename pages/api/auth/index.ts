import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const auth = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const type = req.body.type;
    const data = req.body.value;
    if (type === "load") {
      const token = jwt.sign({ data }, "secret", { expiresIn: "3h" });
      return res.json({ data: token });
    } else if (type === "verify") {
      let token: string 
       jwt.verify(data, "secret", (err :any , decoded : any) => {
          token = decoded
       });
      return res.json({ data: token });
    }
     throw new Error("Server error")
  } catch (error) {
    console.log(error, req.body)
    return res.status(500).json({data : "Server error"}) 
  }
};

export default auth;
