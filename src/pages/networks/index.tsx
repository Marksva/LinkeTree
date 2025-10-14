import { useEffect, useState, type FormEvent } from "react";
import { Header } from "../../components/header";
import { Input } from "../../components/Input";
import { db } from "../../services/firebaseConnection";
import { setDoc, addDoc, getDoc, doc } from "firebase/firestore";

export function Networks() {

    const [gitHub, setGitHub] = useState("");
    const [linkedin, setLinkedin] = useState("");

    useEffect(()=> {
        function loadLinks() {

            const docRef = doc(db, "social", "link");
            getDoc(docRef)
            .then((snapshot) => {
                if(snapshot.data() !== undefined) {
                    setGitHub(snapshot.data()?.github);
                    setLinkedin(snapshot.data()?.linkedin);
                }
            })
        }

        loadLinks();
    }, [])

    function handleRegister(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setDoc(doc(db, "social", "link"), {
            github: gitHub,
            linkedin: linkedin
        }).then(() => {
            console.log("Links cadastrados com sucesso!");
        }).catch((error) => {
            console.log("Erro ao cadastrar os links: ", error);
        })

    }

    return (
        <div className="flex items-center flex-col min-h-screen pb-7 px-2">
            <Header />
            <h1 className="text-white text-2xl font-medium mt-8 mb-4">Minhas redes sociais</h1>

            <form className="flex flex-col max-w-xl w-full" onSubmit={handleRegister}>
                <label className="text-white font-medium mt-2 mb-2">Link do GitHub</label>
                <Input
                    type="url"
                    placeholder="Digite a url do GitHub..."
                    value={gitHub}
                    onChange={(e) => setGitHub(e.target.value)}
                />

                <label className="text-white font-medium mt-2 mb-2">Link do LinkedIn</label>
                <Input
                    type="url"
                    placeholder="Digite a url do LinkedIn..."
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                />

                <button
                    type="submit"
                    className="text-white bg-blue-600 h-9 rounded-md items-center justify-center flex mb-7 font-medium"
                >
                    Salvar links
                </button>
            </form>
        </div>
    )
}