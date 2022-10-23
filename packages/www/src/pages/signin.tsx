import { getProviders, signIn } from "next-auth/react";
import type { Provider } from "next-auth/providers";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";

const SignIn = ({ providers }: { providers: Provider[] }) => {
  const router = useRouter();
  const callbackUrl = (router.query.redirect as string) ?? "/";

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to access this page
            </h2>
          </div>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                onClick={() => signIn(provider.id, { callbackUrl })}
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
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
