import { useEffect, useState } from "react";
import { Social } from "../../components/Social";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { type LinkProps } from "../admin"
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

interface SocialLinksProps {
    github: string;
    linkedin: string;
}

export function Home() {

    const [links, setLinks] = useState<LinkProps[]>([]);
    const [socialLinks, setSocialLinks] = useState<SocialLinksProps>();

    useEffect(() => {

        function loadLinks() {
            const linksRef = collection(db, "links");
            const queryRef = query(linksRef, orderBy("created", "asc"))

            getDocs(queryRef).then((snapshot) => {
                let lista = [] as LinkProps[];
                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        name: doc.data().name,
                        url: doc.data().url,
                        bg: doc.data().bg,
                        color: doc.data().color
                    })
                })

                setLinks(lista);
                console.log(lista);
            })
        }

        loadLinks();

    }, [])

    useEffect(() => {

        function loadSocialLinks() {
            const docRef = doc(db, "social", "link");
            getDoc(docRef).then((snapshot) => {
                if (snapshot.data() !== undefined) {
                    setSocialLinks({
                        github: snapshot.data()?.github,
                        linkedin: snapshot.data()?.linkedin
                    })
                }
            })
        }

        loadSocialLinks();

    }, [])

    return (
        <div className="flex flex-col w-full py-4 items-center justify-center">
            <h1 className="md:text-4xl  text-3xl font-bold text-white mt-20">Mark Silva</h1>
            <span className="text-gray-50 mb-5 mt-3">Veja meus links 👇</span>

            <main className="flex flex-col w-11/12 max-w-xl text-center">

                {links.map((Link) => (
                    <section
                        style={{ backgroundColor: Link.bg }}
                        key={Link.id}
                        className="bg-white mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer"
                    >
                        <a href={Link.url} target="_blank">
                            <p className="text-base md:text-lg" style={{ color: Link.color }}>
                                {Link.name}
                            </p>
                        </a>
                    </section>
                ))}


                {socialLinks && Object.keys(socialLinks).length > 0 && (

                    <footer className="flex justify-center gap-3 my-4">
                        <Social url={socialLinks?.linkedin}>
                            <FaLinkedin color="#fff" size={35} />
                        </Social>
                        <Social url={socialLinks?.github}>
                            <FaGithub color="#fff" size={35} />
                        </Social>
                    </footer>
                )}

            </main>

        </div>
    )
}