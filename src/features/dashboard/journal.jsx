import React, { useEffect, useRef, useState } from "react";
import DashboardBanner from "../../components/DashboardBanner";
import empty from '../../assets/images/empty.png';
import add from '../../assets/icons/Add.svg'
import deleteIcon from '../../assets/icons/delete.svg'
import AppBtn from "../../components/AppBtn";
import Modal from "../../components/modal";
import action from "../../assets/icons/menu.svg";
import AppInput from "../../components/AppInput";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertFromRaw, EditorState } from 'draft-js';
import api from "../../api/api";
import { convertToRaw } from 'draft-js';
import { toast } from "react-toastify";
import axios from "axios";

export default function Journals() {
    const [journals, setJournals] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [isView, setIsView] = useState(false);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [isLoading, setIsLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [form, setForm] = useState({
        title: '',
        volume: 0,
        issue: 0,
        doi: '',
        page: '',
        date: '',
        file: null,
    });

    useEffect(() => {
        fetchJournal();
        document.addEventListener("click", closeAllMenus);

        return () => {
            document.removeEventListener("click", closeAllMenus);
        };
    }, []);

    const closeAllMenus = (e) => {
        setJournals((prevJournals) =>
            prevJournals.map((journal) => ({
                ...journal,
                isOpen: false,
            }))
        );
    };

    const fetchJournal = () => {
        setIsLoading(true)
        api.get('/api/journals').then((res) => {
            if (res && res.status === 200) {
                setIsLoading(false);
                setJournals(res.data.journals);
            }
        }).catch((error) => {
            toast.error(error);
            setIsLoading(false);
            console.error(error);
        })
    }

    const handleEditorChange = (state) => {
        setEditorState(state);
    };

    const handleFileChange = (e) => {
        setForm({
            ...form,
            file: e.target.files[0]
        });
        console.log(e.target.files[0])
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevData) => ({ ...prevData, [name]: value }));
    };

    const openEdit = (data) => {
        let initial = data;
        initial.date = initial.date.split('T')[0];
        setForm(initial);
        setIsEdit(true)
        setIsModalOpen(true);
        const contentState = convertFromRaw(JSON.parse(data.content));
        setEditorState(EditorState.createWithContent(contentState));
    }

    const openView = (data) => {
        setIsView(true);
        setForm(data);
        if (data?.content) {
            try {
                const contentState = convertFromRaw(JSON.parse(data.content));
                setEditorState(EditorState.createWithContent(contentState));
            } catch (error) {
                console.error("Error parsing content:", error);
            }
        } else {
            console.warn("Content is missing or empty.");
            setEditorState(EditorState.createEmpty());
        }
    }

    const publish = async(e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!editorState) {
            console.error("EditorState is undefined.");
            return;
        }

        const contentState = editorState.getCurrentContent();

        // Validate contentState
        if (!contentState) {
            console.error("ContentState is null or undefined.");
            return;
        }

        const rawContent = convertToRaw(contentState);
        const content = JSON.stringify(rawContent);

        // Create FormData object
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("volume", form.volume);
        formData.append("issue", form.issue);
        formData.append("doi", form.doi);
        formData.append("page", form.page);
        formData.append("date", form.date);
        formData.append("content", content);

        const uploads = new FormData();
        // Append file if it exists
        if (form.file) {
            formData.append("file", form.file.name);
            uploads.append("file", form.file)
        } else {
            console.error("No file selected.");
        }
        if (!isEdit) {
            axios.post('https://actabioscientia.org/api/journal-file.php', uploads).then((res) => {
                if(res.status === 200) {
                    postJournal(formData);
                }
            }).catch((error) => {
                console.error(error);
                toast.error(error);
            })

        } else {
            updateJournal(formData);
        }
    };

    const postJournal = (data) => {
        api.post('/api/journals', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            if (res && res.status === 201) {
                setIsLoading(false);
                toast.success(res.data.message);
                closeModal();
                fetchJournal();
            }
        }).catch((error) => {
            setIsLoading(false);
            toast.error("An error occurred. Please try again.");
            console.error("Error serializing content:", error);
        })
    }

    const updateJournal = (data) => {
        console.log(data)
        api.put(`/api/journals/${form._id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            if (res && res.status === 200) {
                setIsLoading(false);
                toast.success(res.data.message);
                closeModal();
                fetchJournal();
            }
        }).catch((error) => {
            setIsLoading(false);
            toast.error("An error occurred. Please try again.");
            console.error("Error serializing content:", error);
        })
    }

    const deleteJournal = () => {
        api.delete(`/api/journals/${deleteId}`).then((res) => {
            if (res && res.status === 200) {
                setIsDeleteModalOpen(false);
                toast.success(res.data.message);
                fetchJournal();
            }
        }).catch((error) => {
            toast.error(error);
            console.error(error)
        })
    }

    const openDeleteModal = (id) => {
        setIsDeleteModalOpen(true);
        setDeleteId(id)
    }

    const openMenu = (itemId) => {
        setJournals((prevJournals) =>
            prevJournals.map((journal) => ({
                ...journal,
                isOpen: journal._id === itemId ? !journal.isOpen : false,
            }))
        );
    };

    const closeModal = () => {
        setIsModalOpen(false)
        setForm({ title: '', volume: 0, issue: 0, doi: '', page: '', date: '', file: null });
        setEditorState(EditorState.createEmpty());
        setIsEdit(false)
        setIsView(false)
    }

    return (
        <div className="flex flex-col gap-6">
            <DashboardBanner title="All journal"
                description="Welcome! Easily post, edit, and delete journals to keep track of your journal history"
                routeTo="Go to dashboard" route="/" />
            <div className="flex justify-between items-center">
                <span className="text-lg">All Journals</span>
                <AppBtn onClick={() => setIsModalOpen(true)} variant="primary">
                    <img src={add} alt="add" />
                    Add Article
                </AppBtn>
            </div>
            <div className="flex bg-white big_card">
                {(journals.length > 0 && !isLoading) && (
                    <div className="flex flex-col w-full">
                        <div className="grid grid-cols-5 md:grid-cols-7 gap-4 bg-blue py-3 px-4 rounded-lg w-full border-b border-b-primary">
                            <div className="w-full col-span-4 md:col-span-3">Title</div>
                            <div className="w-full hidden md:flex md:col-span-2">Date</div>
                            <div className="w-full hidden md:block">Volume</div>
                            <div></div>
                        </div>
                        <div>
                            {journals.map((journal, index) => (
                                <div key={journal._id}><div
                                    className="grid grid-cols-5 md:grid-cols-7 gap-4 py-4 items-center px-4 rounded-lg hover:bg-partial-white cursor-pointer"
                                >
                                    <div className="pr-4 w-full truncate capitalize flex col-span-4 md:col-span-3">
                                        <span className="truncate w-[98%]">
                                            {journal.title}
                                        </span>
                                    </div>
                                    <div className="pr-4 w-full truncate hidden md:flex md:col-span-2">
                                        <span className="w-[98%] truncate">
                                            {new Date(journal.date).toLocaleString("en-US", {
                                                month: "long",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <div className="md:flex gap-2 items-center hidden">
                                        <span className="truncate capitalize">
                                            {journal.volume}
                                        </span>
                                    </div>
                                    <button className="flex justify-end relative">
                                        <img onClick={(e) => { e.stopPropagation(); openMenu(journal._id); }} width={20} height={20} className="cursor-pointer" src={action}
                                            alt="action" />
                                        {journal.isOpen && (
                                            <div className="item-menu top-4 right-[10px] w-[150px]">
                                                <div onClick={() => openView(journal)} className="px-6 text-start py-2 text-deep-blue hover:bg-light-grey">
                                                    View</div>
                                                <div onClick={() => openEdit(journal)} className="px-6 text-start py-2 text-deep-blue hover:bg-light-grey">
                                                    Edit</div>
                                                <div onClick={() => openDeleteModal(journal._id)} className="px-6 text-start py-2 text-red-800 hover:bg-light-grey">Delete</div>
                                            </div>
                                        )}
                                    </button>
                                </div>
                                    {index !== journals.length - 1 &&
                                        <div className="w-full h-[1px] bg-[#e5e5e5]"></div>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {(journals.length === 0 && !isLoading) && (
                    <div className="min-h-[200px] py-8 w-full flex flex-col gap-4 justify-center items-center text-light-blue text-xl">
                        <img height="200" width="200" src={empty} alt="" />
                        No journal
                    </div>
                )}
                {isLoading && (
                    <div className="flex justify-center items-center w-full h-[200px]">
                        <span className="main_loader"></span>
                    </div>
                )}
            </div>
            <Modal isOpen={isModalOpen}>
                <form onSubmit={publish} className="w-full lg:w-[900px] px-4 py-6 bg-white h-full lg:h-[80vh] overflow-y-scroll flex flex-col gap-4 lg:rounded-lg">
                    <AppInput label="Title" required type="text" onChange={handleChange} value={form.title} name="title" id="title"
                        placeholder="Enter journal title" />
                    <AppInput label="Volume" required type="number" onChange={handleChange} value={form.volume} name="volume" id="volume"
                        placeholder="Enter volume" />
                    <AppInput label="Issue" required type="number" onChange={handleChange} value={form.issue} name="issue" id="issue"
                        placeholder="Enter issue" />
                        {!isEdit && <AppInput label="File" required type="file" onChange={handleFileChange} name="file" id={form._id}
                        placeholder="Select file" />}

                    <AppInput label="DOI" required type="text" onChange={handleChange} value={form.doi} name="doi" id="doi"
                        placeholder="Enter DOI" />
                    <AppInput label="Page" required type="text" onChange={handleChange} value={form.page} name="page" id="page"
                        placeholder="Enter page" />
                    <AppInput label="Date" required type="date" onChange={handleChange} value={form.date} name="date" id="date" />

                    <Editor
                        wrapperClassName="editor-wrapper"
                        editorClassName="editor"
                        editorState={editorState}
                        onEditorStateChange={handleEditorChange}
                        toolbar={{
                            options: ['inline', 'list', 'textAlign', 'history', 'fontSize', 'fontFamily',],
                            inline: { inDropdown: true, options: ['bold', 'italic', 'underline'] },
                            list: { inDropdown: true, options: ['unordered', 'ordered'] },
                            textAlign: { 
                                inDropdown: false, 
                                options: ['left', 'center', 'right', 'justify'],
                            },
                            fontSize: { inDropdown: true, options: [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],},
                            fontFamily: { inDropdown: true, options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],},
                        }}
                    />
                    <div className="w-full mt-10 flex gap-3 justify-end">
                        <AppBtn type="button" onClick={closeModal} variant='danger'>Close</AppBtn>
                        <AppBtn isLoading={isLoading} type="submit" variant='primary'>{isEdit ? 'Update Article' : 'Publish Article'}</AppBtn>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={isDeleteModalOpen}>
                <div className="rounded-xl w-[98%] lg:w-[600px] bg-white py-5 px-4 flex items-center text-dark-grey text-center flex-col gap-6">
                    <div className="w-[80px] h-[80px] bg-red-200 rounded-full flex items-center justify-center">
                        <img height="40" width="40" src={deleteIcon} alt="delete" />
                    </div>
                    Are you sure you want to delete this journal?. <br /> This action cannot be undone
                    <div className="flex justify-end items-center gap-4">
                        <AppBtn onClick={() => setIsDeleteModalOpen(false)} variant="outline">Cancel</AppBtn>
                        <AppBtn onClick={() => deleteJournal()} variant="danger">Delete</AppBtn>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isView}>
                <div className="lg:h-[60vh] overflow-y-scroll h-full w-full lg:w-[800px] lg:rounded-lg bg-white px-4 py-6 flex flex-col gap-6">
                    <h2 className="text-xl font-medium text-primary">Journal Details</h2>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-primary">Title</h2>
                        <span className="capitalize">{form.title}</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-primary">Volume</h2>
                            <span>{form.volume}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-primary">Issue</h2>
                            <span className="capitalize">{form.issue}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-primary">DOI</h2>
                            <span className="capitalize">{form.doi}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-primary">Date</h2>
                            <span>{new Date(form.date).toLocaleString("en-US", {
                                month: "long",
                                day: "2-digit",
                                year: "numeric",
                            })}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-primary">Content</h2>
                        <Editor
                            toolbarHidden={true}
                            editorState={editorState}
                            readOnly={true}
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <AppBtn variant="primary" onClick={() => closeModal()}>Close</AppBtn>
                    </div>
                </div>
            </Modal>
        </div>
    )
}