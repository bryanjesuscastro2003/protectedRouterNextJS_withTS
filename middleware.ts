import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const middleware = (req: NextRequest) => {
  const { cookies, url } = req;
  const jwt = cookies.get("protectedNext")?.value;

  const loggedin = Boolean(jwt)
  if (url.includes("/Dashboard")) {
    if (!loggedin)
      return NextResponse.redirect("http://localhost:3000/Auth/Login");
    return NextResponse.next();
  }

  if (url.includes("/Auth")) {
    if (loggedin)
      return NextResponse.redirect("http://localhost:3000/Dashboard");
    return NextResponse.next();
  }

};
export default middleware;

export const config = {
  matcher: ["/Auth/:path*", "/Dashboard/:path*"],
};
