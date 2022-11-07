import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Avatar } from "../../../components/common/avatar";
import { trpc } from "../../../utils/trpc";

export default function ProjectSettings() {
  const id = useRouter().asPath.split("/").pop() as string;
  const utils = trpc.useContext();

  const { data: session, status } = useSession();

  const { data: project } = trpc.customer.projectById.useQuery({ id });

  // mutations
  const { mutate: deleteSource } = trpc.customer.deleteSource.useMutation({
    onSuccess: () => {
      utils.customer.projectById.invalidate({ id });
    },
  });
  const { mutate: deleteDestination } =
    trpc.customer.deleteDestination.useMutation({
      onSuccess: () => {
        utils.customer.projectById.invalidate({ id });
      },
    });
  const { mutate: deleteListener } = trpc.customer.deleteListener.useMutation({
    onSuccess: () => {
      utils.customer.projectById.invalidate({ id });
    },
  });

  if (status === "loading" || !session || !project) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-gray-900">
        {`Projects > ${project.name}`}
      </h1>
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="pt-8">
            <div>
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Basic Information
              </h3>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 ">
              <div>
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Project Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="project-name"
                    id="project-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:text-gray-400 sm:text-sm"
                    defaultValue={project.name}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <div>
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Members
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Who will be able to access this project?
              </p>
            </div>
            <div className="mt-6">
              <div className="space-y-1">
                <label
                  htmlFor="add-team-members"
                  className="block text-sm font-medium text-gray-700"
                >
                  Add Team Members
                </label>
                <p id="add-team-members-helper" className="sr-only">
                  Search by email address
                </p>
                <div className="flex">
                  <div className="flex-grow">
                    <input
                      type="text"
                      name="add-team-members"
                      id="add-team-members"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      placeholder="Email address"
                      aria-describedby="add-team-members-helper"
                    />
                  </div>
                  <span className="ml-3">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    >
                      <PlusIcon
                        className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span>Add</span>
                    </button>
                  </span>
                </div>
              </div>
              <div className="mt-6 rounded-md bg-gray-100 px-4">
                <div className="border-b border-gray-200">
                  <ul role="list" className="divide-y divide-gray-200">
                    {project.Members.map((person) => (
                      <li key={person.id} className="flex py-4">
                        <div className="flex w-full flex-row items-center justify-between">
                          <div className="flex flex-row items-center">
                            <Avatar image={person.user.image} />
                            <div className="ml-3 flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {person.user.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                {person.user.email}
                              </span>
                            </div>
                          </div>
                          {person.role !== "OWNER" ? (
                            <button>
                              <TrashIcon className="h-5 w-5  text-gray-500 hover:text-red-600" />
                            </button>
                          ) : (
                            <span className="text-sm text-gray-500">Owner</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Sources
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Where will your webhooks be coming from?
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Add +
              </button>
            </div>
          </div>
          <div className="mt-6 rounded-md bg-gray-100 px-4">
            <div className="border-b border-gray-200">
              <ul role="list" className="divide-y divide-gray-200">
                {project.Sources.length > 0 ? (
                  project.Sources.map((source) => (
                    <li key={source.id} className="flex py-4">
                      <div className="flex w-full flex-row items-center justify-between">
                        <div className="ml-3 flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {source.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {source.domain}
                          </span>
                        </div>
                        <div className="flex flex-row gap-2">
                          <PencilIcon className="h-5 w-5  text-gray-500 hover:text-blue-600" />
                          <button
                            onClick={() => deleteSource({ id: source.id })}
                          >
                            <TrashIcon className="h-5 w-5  text-gray-500 hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="flex py-4">
                    <div className="flex w-full flex-row items-center justify-center">
                      <div className="ml-3 flex flex-col items-center justify-center">
                        <span className="text-sm font-medium text-gray-900">
                          No sources yet!
                        </span>
                        <span className="text-sm text-gray-500">
                          Add a source to get started.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              Destinations
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Where will your webhooks be routed to?
            </p>
          </div>
          <div className="mt-6 space-y-6">
            <div>
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h4 className="text-lg font-medium leading-6 text-gray-900">
                    Hosted Endpoints
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    These are places where you can send your webhooks to. For
                    example, you can send your webhooks to a Slack channel, a
                    Discord server, or your own application server.
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                  >
                    Add +
                  </button>
                </div>
              </div>
              <div className="mt-6 rounded-md bg-gray-100 px-4">
                <div className="border-b border-gray-200">
                  <ul role="list" className="divide-y divide-gray-200">
                    {project.Destinations.length > 0 ? (
                      project.Destinations.map((destination) => (
                        <li key={destination.id} className="flex py-4">
                          <div className="flex w-full flex-row items-center justify-between">
                            <div className="ml-3 flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {destination.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                {destination.url}
                              </span>
                            </div>
                            <div className="flex flex-row gap-2">
                              <PencilIcon className="h-5 w-5  text-gray-500 hover:text-blue-600" />
                              <button
                                onClick={() =>
                                  deleteDestination({ id: destination.id })
                                }
                              >
                                <TrashIcon className="h-5 w-5  text-gray-500 hover:text-red-600" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <div className="flex py-4">
                        <div className="flex w-full flex-row items-center justify-center">
                          <div className="ml-3 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-gray-900">
                              No destinations yet!
                            </span>
                            <span className="text-sm text-gray-500">
                              Add a destination to get started.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium leading-6 text-gray-900">
                Local Listeners
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                These are the development environments that have been connected
                to this project using the Captain CLI.
              </p>
              <div className="mt-6 rounded-md bg-gray-100 px-4">
                <div className="border-b border-gray-200">
                  <ul role="list" className="divide-y divide-gray-200">
                    {project.LocalListeners.length > 0 ? (
                      project.LocalListeners.map((listener) => (
                        <li key={listener.id} className="flex py-4">
                          <div className="flex w-full flex-row items-center justify-between">
                            <div className="ml-3 flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {listener.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                {`Last Seen: ${listener.lastSeen?.toLocaleString()}`}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                deleteListener({ id: listener.id })
                              }
                            >
                              <TrashIcon className="h-5 w-5  text-gray-500 hover:text-red-600" />
                            </button>
                          </div>
                        </li>
                      ))
                    ) : (
                      <div className="flex py-4">
                        <div className="flex w-full flex-row items-center justify-center">
                          <div className="ml-3 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-gray-900">
                              No local listeners yet!
                            </span>
                            <span className="text-sm text-gray-500">
                              Connect via Captain CLI to get started.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
