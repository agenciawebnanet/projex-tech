import { NextRequest, NextResponse } from 'next/server';
export function proxy(request:NextRequest){if(request.nextUrl.pathname==='/admin/login')return NextResponse.next();const secret=process.env.ADMIN_PASSWORD;if(!secret)return NextResponse.redirect(new URL('/admin/login?setup=1',request.url));if(request.cookies.get('projex_admin')?.value!==secret)return NextResponse.redirect(new URL('/admin/login',request.url));return NextResponse.next()}
export const config={matcher:['/admin/:path*']};
