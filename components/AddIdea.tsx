import {
    Button,
    Dialog,
    Flex,
    IconButton,
    Text,
    TextArea,
    TextField,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { doc, updateDoc } from "firebase/firestore";
import db from "@/app/db";
import { v4 as uuidv4 } from "uuid";

const AddIdea = ({ workspace }: { workspace: Workspace | undefined }) => {
    const addIdea = async () => {
        const name = (
            document.getElementById("idea-name") as HTMLInputElement
        ).value.trim();
        const description = (
            document.getElementById("idea-description") as HTMLInputElement
        ).value.trim();

        const newIdea = { id: uuidv4(), name, description };

        if (workspace && name !== "") {
            const ideas = workspace.ideas
                ? [...workspace.ideas, newIdea]
                : [newIdea];

            await updateDoc(doc(db, "workspaces", workspace.id), {
                ideas,
            });
        }
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <IconButton
                    style={{
                        cursor: !workspace ? "not-allowed" : "pointer",
                    }}
                    size="4"
                    variant="soft"
                    disabled={workspace === undefined}
                >
                    <PlusIcon />
                </IconButton>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 450 }}>
                <Dialog.Title>Add Idea</Dialog.Title>

                <Flex direction="column" gap="3">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Name
                        </Text>
                        <TextField.Input
                            id="idea-name"
                            placeholder="Name your idea... (Max. 25 chars)"
                            maxLength={25}
                        />
                    </label>
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Description
                        </Text>
                        <TextArea
                            id="idea-description"
                            placeholder="Enter some basic description... (Mainly for AI)"
                        />
                    </label>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button onClick={addIdea}>Save</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default AddIdea;
