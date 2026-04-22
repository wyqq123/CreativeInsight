import { BadRequestException, Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { ok } from "../../common/response";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post("login")
  async login(
    @Body() body: { email: string; orgName: string; displayName?: string },
    @Headers("x-request-id") requestId?: string,
  ) {
    if (!body.email || !body.orgName) throw new BadRequestException("email and orgName are required");
    return ok(requestId, await this.service.login(body.email, body.orgName, body.displayName, requestId));
  }

  @Get("me")
  async me(@Headers("authorization") authorization?: string, @Headers("x-request-id") requestId?: string) {
    const userId = authorization?.replace("Bearer ", "").replace("dev-token-", "");
    if (!userId) throw new BadRequestException("Authorization bearer token is required");
    const me = await this.service.me(userId);
    if (!me) throw new BadRequestException("user not found");
    return ok(requestId, me);
  }
}
