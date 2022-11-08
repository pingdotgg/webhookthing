import { AutoAnimate } from "../../../components/util/autoanimate";
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { Avatar } from "../../../components/common/avatar";
import { trpc } from "../../../utils/trpc";
import { Modal } from "../../../components/common/modal";

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

  const { mutate: addMember } = trpc.customer.addMemberToProject.useMutation({
    onSuccess: () => {
      utils.customer.projectById.invalidate({ id });
      setAddMemberRole("VIEWER");
      setAddMemberEmail("");
    },
  });

  const { mutate: removePendingMember } =
    trpc.customer.removePendingMember.useMutation({
      onSuccess: () => {
        utils.customer.projectById.invalidate({ id });
      },
    });

  const { mutate: updateMemberRole } =
    trpc.customer.updateMemberRole.useMutation({
      onSuccess: () => {
        utils.customer.projectById.invalidate({ id });
      },
    });

  const { mutate: updatePendingMemberRole } =
    trpc.customer.updatePendingMemberRole.useMutation({
      onSuccess: () => {
        utils.customer.projectById.invalidate({ id });
      },
    });

  const [addMemberEmail, setAddMemberEmail] = useState("");
  const [addMemberRole, setAddMemberRole] = useState("VIEWER");

  const createSourceModalState = useState(false);
  const createDestinationModalState = useState(false);

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
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Email address"
                      aria-describedby="add-team-members-helper"
                      value={addMemberEmail}
                      onChange={(e) => setAddMemberEmail(e.target.value)}
                    />
                  </div>
                  <div className="ml-3">
                    <select
                      id="role"
                      name="role"
                      className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      value={addMemberRole}
                      onChange={(e) => setAddMemberRole(e.target.value)}
                    >
                      <option value={"VIEWER"}>Viewer</option>
                      <option value={"ADMIN"}>Admin</option>
                    </select>
                  </div>
                  <span className="ml-3">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:bg-indigo-600 sm:w-auto"
                      disabled={!addMemberEmail}
                      onClick={() => {
                        addMember({
                          projectId: project.id,
                          email: addMemberEmail,
                          role: addMemberRole as "VIEWER" | "ADMIN",
                        });
                      }}
                    >
                      <PlusIcon
                        className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      Add
                    </button>
                  </span>
                </div>
              </div>
              <div className="mt-6 rounded-md bg-gray-100 px-4">
                <div className="border-b border-gray-200">
                  <AutoAnimate
                    as="ul"
                    role="list"
                    className="divide-y divide-gray-200"
                  >
                    {project.Members.map((person) => (
                      <li key={person.userId} className="flex py-4">
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
                            <div className="flex flex-row items-center gap-2">
                              <select
                                id="role"
                                name="role"
                                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                defaultValue={person.role}
                                onChange={(e) => {
                                  updateMemberRole({
                                    projectId: project.id,
                                    userId: person.userId,
                                    role: e.target.value as "VIEWER" | "ADMIN",
                                  });
                                }}
                              >
                                <option value={"VIEWER"}>Viewer</option>
                                <option value={"ADMIN"}>Admin</option>
                              </select>
                              <button>
                                <TrashIcon className="h-5 w-5  text-gray-500 hover:text-red-600" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Owner</span>
                          )}
                        </div>
                      </li>
                    ))}
                    {project.PendingMembers.map((person) => (
                      <li key={person.email} className="flex py-4">
                        <div className="flex w-full flex-row items-center justify-between">
                          <div className="flex flex-row items-center">
                            <Avatar />
                            <div className="ml-3 flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                Invite Pending
                              </span>
                              <span className="text-sm text-gray-500">
                                {person.email}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-row items-center gap-2">
                            <select
                              id="role"
                              name="role"
                              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              defaultValue={person.role}
                              onChange={(e) => {
                                updatePendingMemberRole({
                                  projectId: project.id,
                                  email: person.email,
                                  role: e.target.value as "VIEWER" | "ADMIN",
                                });
                              }}
                            >
                              <option value={"VIEWER"}>Viewer</option>
                              <option value={"ADMIN"}>Admin</option>
                            </select>
                            <button
                              onClick={() =>
                                removePendingMember({
                                  projectId: project.id,
                                  email: person.email,
                                })
                              }
                            >
                              <TrashIcon className="h-5 w-5  text-gray-500 hover:text-red-600" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </AutoAnimate>
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
              <CreateSourceModal
                openState={createSourceModalState}
                projectId={project.id}
              />
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                onClick={() => {
                  createSourceModalState[1](true);
                }}
              >
                <PlusIcon
                  className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Add Source
              </button>
            </div>
          </div>
          <div className="mt-6 rounded-md bg-gray-100 px-4">
            <div className="border-b border-gray-200">
              <AutoAnimate
                as="ul"
                role="list"
                className="divide-y divide-gray-200"
              >
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
              </AutoAnimate>
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
                  <CreateDestinationModal
                    openState={createDestinationModalState}
                    projectId={project.id}
                  />
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    onClick={() => {
                      createDestinationModalState[1](true);
                    }}
                  >
                    <PlusIcon
                      className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Add Destination
                  </button>
                </div>
              </div>
              <div className="mt-6 rounded-md bg-gray-100 px-4">
                <div className="border-b border-gray-200">
                  <AutoAnimate
                    as="ul"
                    role="list"
                    className="divide-y divide-gray-200"
                  >
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
                  </AutoAnimate>
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
                  <AutoAnimate
                    as="ul"
                    role="list"
                    className="divide-y divide-gray-200"
                  >
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
                  </AutoAnimate>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CreateSourceModal: React.FC<{
  projectId: string;
  openState: [boolean, Dispatch<SetStateAction<boolean>>];
}> = ({ openState, projectId }) => {
  const utils = trpc.useContext();

  const [sourceName, setSourceName] = useState("");
  const [domain, setDomain] = useState("");

  const { mutate: createSource } = trpc.customer.createSource.useMutation({
    onSuccess: () => {
      utils.customer.projectById.invalidate({ id: projectId });
      setSourceName("");
      setDomain("");
      openState[1](false);
    },
  });

  return (
    <Modal openState={openState}>
      <div className="rounded-md bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:text-left">
            <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => openState[1](false)}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Create Source
            </h3>
            <div className="mt-2">
              <label
                htmlFor="source-name"
                className="block text-sm font-medium text-gray-700"
              >
                Source Name
              </label>
              <input
                type="text"
                name="source-name"
                id="source-name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:text-gray-400 sm:text-sm"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
              />
              <label
                htmlFor="Domain"
                className="block text-sm font-medium text-gray-700"
              >
                Domain
              </label>
              <input
                type="text"
                name="Domain"
                id="Domain"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:text-gray-400 sm:text-sm"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => {
                    createSource({ name: sourceName, projectId, domain });
                    openState[1](false);
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const CreateDestinationModal: React.FC<{
  projectId: string;
  openState: [boolean, Dispatch<SetStateAction<boolean>>];
}> = ({ openState, projectId }) => {
  const utils = trpc.useContext();

  const [destinationName, setDestinationName] = useState("");
  const [url, setUrl] = useState("");

  const { mutate: createDestination } =
    trpc.customer.createDestination.useMutation({
      onSuccess: () => {
        utils.customer.projectById.invalidate({ id: projectId });
        setDestinationName("");
        setUrl("");
        openState[1](false);
      },
    });

  return (
    <Modal openState={openState}>
      <div className="rounded-md bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:text-left">
            <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => openState[1](false)}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Create Destination
            </h3>
            <div className="mt-2">
              <label
                htmlFor="destination-name"
                className="block text-sm font-medium text-gray-700"
              >
                Destination Name
              </label>
              <input
                type="text"
                name="destination-name"
                id="destination-name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:text-gray-400 sm:text-sm"
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
              />
              <label
                htmlFor="Domain"
                className="block text-sm font-medium text-gray-700"
              >
                URL
              </label>
              <input
                type="text"
                name="Domain"
                id="Domain"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:text-gray-400 sm:text-sm"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => {
                    createDestination({
                      name: destinationName,
                      projectId,
                      url,
                    });
                    openState[1](false);
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
