// next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      /** 우리는 user.id를 쓸 거니까 여기에 추가 */
      id: string;
    };
  }

  // Credential Provider 같은 경우 user 객체에 id를 넣어주므로,
  // JWT 토큰에도 id를 추가해 줘야 나중에 session 콜백에서 꺼낼 수 있습니다.
  interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
