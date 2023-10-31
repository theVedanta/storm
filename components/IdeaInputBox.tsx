"use client";

import dynamic from "next/dynamic";
import { Box, Flex, Heading, IconButton } from "@radix-ui/themes";
import React, { useRef, useState } from "react";
import { OutputData } from "@editorjs/editorjs";
import { doc, updateDoc } from "firebase/firestore";
import db from "@/app/db";
import { TrashIcon } from "@radix-ui/react-icons";
const Editor = dynamic(() => import("./Editor"), {
    ssr: false,
});

interface Props {
    idea: Idea;
    workspace: Workspace | undefined;
}

const IdeaInputBox = ({ idea, workspace }: Props) => {
    const editorRef = useRef(null);
    const [created, setCreated] = useState(false);

    const saveChanges = async () => {
        if (editorRef.current && workspace) {
			// @ts-ignore
            const outData: OutputData = await editorRef.current.save();

            const updatedIdeas = workspace.ideas?.map((item: Idea) => {
                if (item.id === idea.id) {
                    return { ...item, notes: outData };
                } else return { ...item };
            });

            await updateDoc(doc(db, "workspaces", workspace.id), {
                ideas: updatedIdeas,
            });
        }
    };

    const removeIdea = async () => {
        if (workspace && workspace.ideas) {
            const ideas = workspace.ideas.filter(
                (item, i) => item.id !== idea.id
            );
            await updateDoc(doc(db, "workspaces", workspace.id), {
                ideas,
            });
        }
    };

    return (
        <Box
            style={{
                position: "absolute",
                width: "400px",
                maxHeight: "300px",
                background: "#fff",
                border: "2px solid #eaeefe",
                top: "60%",
                left: "60%",
                padding: "28px",
                borderRadius: "10px",
                cursor: "text",
                overflow: "scroll",
                textAlign: "left",
                resize: "both",
            }}
        >
            <Flex justify="between">
                <Heading style={{ fontSize: "19px", fontWeight: "600" }}>
                    {idea.name}
                </Heading>
                <IconButton
                    size="2"
                    variant="soft"
                    color="red"
                    onClick={() => removeIdea()}
                >
                    <TrashIcon />
                </IconButton>
            </Flex>
            <hr />

            <Editor
                workspace={workspace}
                name="idea"
                editorRef={editorRef}
                setUser={null}
                setCreated={setCreated}
                created={created}
                saveChanges={saveChanges}
                data={idea.notes}
            />
        </Box>
    );
};

export default IdeaInputBox;
