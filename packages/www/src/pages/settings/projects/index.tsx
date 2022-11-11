import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal, useConfirmationModal } from "../../../components/common/modal";
import { AutoAnimate } from "../../../components/util/autoanimate";
import { trpc } from "../../../utils/trpc";
import { useRequireAuth } from "../../../utils/use-require-auth";

const ProjectsSettings: NextPage = () => {
  useRequireAuth();

  const { data: session, status } = useSession();
  const utils = trpc.useContext();

  const { data: projects } = trpc.customer.allProjects.useQuery();

  const { mutate: deleteProjects } = trpc.customer.deleteProjects.useMutation({
    onSuccess: () => {
      utils.customer.allProjects.invalidate();
    },
  });

  const [checked, setChecked] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const modalOpenState = useState(false);

  const openDeleteModal = useConfirmationModal({
    title: "Delete Projects",
    description:
      "Are you sure you want to delete the selected projects? This action cannot be undone. This will also delete all of the data associated with the project (e.g. sources, destinations, etc).",
    confirmationLabel: "Delete",
    variant: "danger",
    icon: <TrashIcon className="h-6 w-6 text-white" aria-hidden="true" />,
    onConfirm: () => {
      deleteProjects({ idsToDelete: selectedProjects });
      setSelectedProjects([]);
    },
  });

  if (status === "loading" || !session) return null;

  return (
    <>
      <CreateProjectModal openState={modalOpenState} />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the projects in your account.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              onClick={() => modalOpenState[1](true)}
            >
              Add Project +
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full table-fixed divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="relative w-12 px-6 sm:w-16 sm:px-8"
                      >
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                          checked={checked}
                          onChange={(e) => {
                            setChecked(e.target.checked);
                            setSelectedProjects(
                              e.target.checked
                                ? (projects ?? []).map((p) => p.id)
                                : []
                            );
                          }}
                        />
                      </th>
                      <th
                        scope="col"
                        className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Owner
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <AutoAnimate
                    as="tbody"
                    className="divide-y divide-gray-200 bg-white"
                  >
                    {(projects ?? []).map((p) => (
                      <tr
                        key={p.id}
                        className={
                          selectedProjects.includes(p.id)
                            ? "bg-gray-50"
                            : undefined
                        }
                      >
                        <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                          {selectedProjects.includes(p.id) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                            value={p.name}
                            checked={selectedProjects.includes(p.id)}
                            onChange={(e) =>
                              setSelectedProjects(
                                e.target.checked
                                  ? [...selectedProjects, p.id]
                                  : selectedProjects.filter((p) => p !== p)
                              )
                            }
                          />
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap py-4 pr-3 text-sm font-medium",
                            selectedProjects.includes(p.id)
                              ? "text-indigo-600"
                              : "text-gray-900"
                          )}
                        >
                          {p.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {p.Members.find((m) => m.role === "OWNER")?.userId ===
                          session.user?.id
                            ? "You"
                            : p.Members.find((m) => m.role === "OWNER")?.user
                                ?.name ?? "No Owner"}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a
                            href={`/settings/projects/${p.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit<span className="sr-only">, {p.name}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </AutoAnimate>
                </table>
              </div>
              {selectedProjects.length > 0 && (
                <button
                  className="m-2 inline-flex items-center rounded-full border border-transparent bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => openDeleteModal()}
                >
                  Delete Selected
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsSettings;

const CreateProjectModal: React.FC<{
  openState: [boolean, Dispatch<SetStateAction<boolean>>];
}> = ({ openState }) => {
  const utils = trpc.useContext();

  const [projectName, setProjectName] = useState("");

  const { mutate: createProject } = trpc.customer.createProject.useMutation({
    onSuccess: () => {
      utils.customer.allProjects.invalidate();
      setProjectName("");
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
              Create Project
            </h3>
            <div className="mt-2">
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-gray-700"
              >
                Project Name
              </label>
              <input
                type="text"
                name="project-name"
                id="project-name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:text-gray-400 sm:text-sm"
                placeholder="My Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => {
                    createProject({ name: projectName });
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
