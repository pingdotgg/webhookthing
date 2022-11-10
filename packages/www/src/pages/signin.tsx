import { getProviders, signIn } from "next-auth/react";
import type { Provider } from "next-auth/providers";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { NoLayout } from "../components/layout/app-layout";
import { ForwardIcon } from "@heroicons/react/24/outline";

const SignIn = ({ providers }: { providers: Provider[] }) => {
  const router = useRouter();
  const callbackUrl = (router.query.redirect as string) ?? "/";

  return (
    <div className="flex h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <ForwardIcon className="mx-auto h-12 w-auto text-indigo-600" />
            <h1 className="text-center text-3xl font-extrabold text-gray-900">
              Captain
            </h1>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Sign in to access this page
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                  <button
                    type="button"
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() =>
                      signIn(provider.id, { callbackUrl: callbackUrl })
                    }
                  >
                    Sign In with {provider.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

SignIn.getLayout = NoLayout;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
