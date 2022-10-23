import { getProviders, signIn } from "next-auth/react";
import type { Provider } from "next-auth/providers";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";

const SignIn = ({ providers }: { providers: Provider[] }) => {
  const router = useRouter();
  const callbackUrl = (router.query.redirect as string) ?? "/";

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl tracking-tight font-bold text-gray-900">
              Sign in to access this page
            </h2>
          </div>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                onClick={() => signIn(provider.id, { callbackUrl })}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with {provider.name}</span>
                <span className="capitalize">{provider.name}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
