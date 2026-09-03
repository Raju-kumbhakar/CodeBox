'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen grid w-full items-center bg-zinc-100 px-4 font-mono text-sm">
      {/* ADD path="/sign-in" HERE */}
      <SignIn.Root path="/sign-in">
        {/* START STEP */}
        <SignIn.Step
          name="start"
          className="mx-auto w-full sm:w-96 space-y-6 bg-white px-4 py-8 border-4 border-black shadow-[8px_8px_0_0_#000]"
        >
          <header className="text-center flex flex-col items-center">
            <Image src={'/logo.png'} alt='logo' width={40} height={40} />
            <h1 className="mt-3 text-3xl font-game tracking-wide text-black uppercase">
              Sign in to CodeBox
            </h1>
          </header>

          <Clerk.GlobalError className="block text-sm text-red-500" />

          {/* GOOGLE LOGIN */}
          <Clerk.Connection
            name="google"
            className="flex w-full items-center justify-center gap-3 px-4 py-2 bg-yellow-400 border-2 border-black shadow-[4px_4px_0_0_#000] active:translate-y-[2px] active:shadow-none font-game cursor-pointer"
          >
            <Clerk.Icon className="size-5 text-black" />
            <span className="text-black text-xl">Login with Google</span>
          </Clerk.Connection>

          {/* EMAIL & PASSWORD */}
          <div className="space-y-4">
            <Clerk.Field name="identifier" className="space-y-1">
              <Clerk.Label className="font-game text-black uppercase text-2xl">Email</Clerk.Label>
              <Clerk.Input
                type="email"
                required
                className="w-full px-3 py-2 bg-white border-2 border-black shadow-[3px_3px_0_0_#000] outline-none focus:border-yellow-500"
              />
              <Clerk.FieldError className="text-sm text-red-500" />
            </Clerk.Field>

            <Clerk.Field name="password" className="space-y-1">
              <Clerk.Label className="font-game text-black uppercase text-2xl">Password</Clerk.Label>
              <Clerk.Input
                type="password"
                required
                className="w-full px-3 py-2 bg-white border-2 border-black shadow-[3px_3px_0_0_#000] outline-none focus:border-yellow-500"
              />
              <Clerk.FieldError className="text-sm text-red-500" />
            </Clerk.Field>
          </div>

          {/* SUBMIT BUTTON */}
          <SignIn.Action
            submit
            className="w-full px-4 py-2 bg-yellow-400 border-2 border-black shadow-[4px_4px_0_0_#000] active:translate-y-[2px] active:shadow-none text-black font-game uppercase text-xl cursor-pointer"
          >
            Sign In
          </SignIn.Action>

          <p className="text-center font-game text-xl text-black">
            No account?{' '}
            <Clerk.Link
              navigate="sign-up"
              className="font-game underline underline-offset-2 hover:text-yellow-600"
            >
              Create an account
            </Clerk.Link>
          </p>
        </SignIn.Step>

        {/* SSO CALLBACK STEP */}
        <SignIn.Step name="sso-callback">
          <div className="mx-auto w-full sm:w-96 text-center space-y-4 bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_#000]">
            <Loader2 className="animate-spin mx-auto size-8 text-yellow-500" />
            <p className="font-game text-xl text-black">Completing sign in...</p>
          </div>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  )
}