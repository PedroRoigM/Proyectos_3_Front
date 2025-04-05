'use server';
import PatchValidation from "../components/lib/validate";
import Validation from "../components/Validation";

export default async function Page() {

    async function handleSubmit(code) {
        "use server"
        return await PatchValidation(code);
    };

    return <Validation sendCode={handleSubmit} />;
}