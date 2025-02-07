'use client';

import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import styles from './styles.module.scss';
import { FormEvent, useEffect, useState } from "react";
import profileService from "../../../services/profileService";
import ToastComponent from "../../common/toastComponent";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BtnSpinner from "../../common/btnSpinner";
import { CameraAlt } from "@mui/icons-material";

export default function UserForm() {
    const router = useRouter();
    const [toastIsOpen, setToastIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [color, setColor] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [userStats, setUserStats] = useState(false);
    const [profilePicture, setProfilePicture] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [serie, setSerie] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [initialEmail, setInitialEmail] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        profileService.fetchCurrent().then((user) => {
            setProfilePicture(user.profileImage);
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setPhone(user.phone);
            setSerie(user.serie);
            setEmail(user.email);
            setInitialEmail(user.email);
            setCreatedAt(user.createdAt);
            setUserStats(user.hasFullAccess);
        });
    }, []);

    const handleUserUpdate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const res = await profileService.userUpdate({
            firstName,
            lastName,
            serie,
            phone,
            email,
            createdAt,
        });

        if (res === 200 || res === 201) {
            setErrorMessage("Informações alteradas com sucesso!");
            setColor("bg-success");
            setToastIsOpen(true);
            setTimeout(() => setToastIsOpen(false), 2500);
            if (email !== initialEmail) {
                sessionStorage.clear();
                router.push("/");
            }
        } else {
            setErrorMessage("Você não pode mudar para esse email!");
            setColor("bg-danger");
            setToastIsOpen(true);
            setTimeout(() => setToastIsOpen(false), 2500);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setLoading(true);
            try {
                const updatedUser = await profileService.uploadProfilePicture(event.target.files[0]);
                if (updatedUser) {
                    setProfilePicture(updatedUser.profileImage);
                    setErrorMessage("Foto de perfil atualizada com sucesso");
                    setColor("bg-success");
                } else {
                    throw new Error();
                }
            } catch {
                setErrorMessage("Erro ao atualizar foto de perfil");
                setColor("bg-danger");
            } finally {
                setToastIsOpen(true);
                setTimeout(() => setToastIsOpen(false), 2500);
                setLoading(false);
            }
        }
    };

    const date = new Date(createdAt);
    const month = date.toLocaleDateString("pt-BR", { month: "long" });

    return (
        <section className={styles.userSection}>
            <Form className={styles.forms} onSubmit={handleUserUpdate}>
                <header className={styles.userHeader}>
                    <div className={styles.profileImageContainer}>
                        <label className={styles.uploadWrapper}>
                            {profilePicture ? (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BASEURL}/${profilePicture}`}
                                    alt="Foto do Usuário"
                                    width={120}
                                    height={120}
                                    className={styles.profileImage}
                                />
                            ) : (
                                <div className={styles.nameAbbreviation}>
                                    {firstName.slice(0, 1)}
                                    {lastName.slice(0, 1)}
                                </div>
                            )}
                            <div className={styles.cameraOverlay}>
                                <CameraAlt className={styles.cameraIcon} />
                                <Input
                                    type="file"
                                    className={styles.hiddenFileInput}
                                    onChange={handleFileChange}
                                    disabled={loading}
                                    accept="image/*"
                                />
                            </div>
                        </label>
                    </div>
                    <h2 className={styles.formTitle}>{firstName} {lastName}</h2>
                    <div className={styles.statusBadge}>{userStats ? "PREMIUM" : "FREE"}</div>
                </header>

                <div className={styles.memberInfo}>
                    <Image src="/logo-vocenotadez.png" alt="Logo" width={60} height={60} className={styles.memberLogo} />
                    <p className={styles.memberText}>
                        Membro desde {`${date.getDate()} de ${month} de ${date.getFullYear()}`}
                    </p>
                </div>

                <hr className={styles.hr} />

                <div className={styles.inputGroup}>
                    <FormGroup>
                        <Label className={styles.label} htmlFor="firstName">
                            NOME
                        </Label>
                        <Input
                            name="firstName"
                            type="text"
                            id="firstName"
                            placeholder="Digite seu primeiro nome"
                            required
                            maxLength={20}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className={styles.input}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label className={styles.label} htmlFor="lastName">
                            SOBRENOME
                        </Label>
                        <Input
                            name="lastName"
                            type="text"
                            id="lastName"
                            placeholder="Digite seu sobrenome"
                            required
                            maxLength={20}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className={styles.input}
                        />
                    </FormGroup>
                </div>

                <div className={styles.inputGroupVertical}>
                    <FormGroup>
                        <Label className={styles.label} htmlFor="phone">
                            WHATSAPP / TELEGRAM
                        </Label>
                        <Input
                            name="phone"
                            type="tel"
                            id="phone"
                            placeholder="(xx) 9xxxx-xxxx"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={styles.input}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label className={styles.label} htmlFor="email">
                            E-MAIL
                        </Label>
                        <Input
                            name="email"
                            type="email"
                            id="email"
                            placeholder="Seu email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label className={styles.label} htmlFor="serie">
                            ESCOLHA SUA SÉRIE
                        </Label>
                        <Input
                            type="select"
                            name="serie"
                            id="serie"
                            required
                            value={serie}
                            onChange={(e) => setSerie(e.target.value)}
                            className={styles.select}
                        >
                            <option value="6º ano">6º ano</option>
                            <option value="7º ano">7º ano</option>
                            <option value="8º ano">8º ano</option>
                            <option value="9º ano">9º ano</option>
                        </Input>
                    </FormGroup>
                </div>

                <Button type="submit" className={styles.submitButton}>
                    Salvar Alterações
                </Button>

                <ToastComponent color={color} isOpen={toastIsOpen} message={errorMessage} />
            </Form>
        </section>
    );
}
