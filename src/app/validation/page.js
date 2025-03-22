'use server';
import PatchValidation from "../components/lib/validate";
import Validation from "../components/Validation";

export default async function Page() {

    async function handleSubmit(code) {
        "use server"
        const result = await PatchValidation(code);
        if (!result) {
            return null; // Si hay un error, se mostrará el mensaje de error
        }
    };

    return <Validation sendCode={handleSubmit} />;
}