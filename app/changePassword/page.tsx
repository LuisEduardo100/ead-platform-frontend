'use client'
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";
import HeaderNoAuth from "../../src/components/HomeNoAuth/header";
import styles from '../styles/changePassword.module.scss'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FormEvent, useEffect, useState } from "react";
import profileService, { UserParams } from "../../src/services/profileService";
import { useRouter, useSearchParams } from "next/navigation";
import ToastComponent from "../../src/components/common/toastComponent";

const validatePasswordStrength = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

export default function passwordReset() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [color, setColor] = useState("");
    const [toastIsOpen, setToastIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const searchParams = useSearchParams()
    const router = useRouter();
    const [user, setUser] = useState(null)
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    useEffect(() => {
        profileService.fetchCurrent().then((user) => {
            setUser(user)
        });
    }, []);

    const handlePasswordUpdate = async function (event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

    const token = searchParams.get("token"); // Recupera o token da URL

    if (!token) {
        setToastIsOpen(true);
        setErrorMessage("Token não encontrado na URL.");
        setColor("bg-danger");
        setTimeout(() => setToastIsOpen(false), 700 * 3);
        return;
    }

    if (newPassword !== confirmNewPassword) {
        setToastIsOpen(true);
        setErrorMessage("Senha e confirmação de senha são diferentes!");
        setColor("bg-danger");
        setTimeout(() => setToastIsOpen(false), 700 * 3);
        return;
    }

    if (!validatePasswordStrength(newPassword)) {
        setToastIsOpen(true);
        setErrorMessage("A senha deve conter pelo menos 8 caracteres, incluindo letras e números.");
        setColor("bg-danger");
        setTimeout(() => setToastIsOpen(false), 700 * 3);
    } else {
        const { status } = await profileService.recoverPassword(
            { newPassword },
            token // Passa o token para a API
        );
    
        if (status === 204) {
            setToastIsOpen(true);
            setErrorMessage("Senha alterada com sucesso!");
            setColor("bg-success");
            setTimeout(() => setToastIsOpen(false), 3000);
            router.push("/login"); // Redireciona para a página de login
        } else {
            setToastIsOpen(true);
            setErrorMessage("Ocorreu um erro durante o processo.");
            setColor("bg-danger");
            setTimeout(() => setToastIsOpen(false), 3000);
        }
    }
};


    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible)
    }

    return <>
        <main>
            <HeaderNoAuth />
            <Container className="pt-5">
                <Form className={styles.principal} onSubmit={(event) => handlePasswordUpdate(event)}>
                    <FormGroup className={styles.formPasswordGroup}>
                        <Label for="password">NOVA SENHA</Label>
                        <div className={styles.password_wrapper}>
                            <Input
                                id="password"
                                name="password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                required
                                value={newPassword}
                                onChange={(event) => {
                                    setNewPassword(event.target.value)
                                }}
                                placeholder="Digite a sua senha"
                                className={styles.input}
                            />
                            <span className={styles.visibility} onClick={togglePasswordVisibility}>
                                {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                            </span>
                        </div>
                    </FormGroup>
                    <FormGroup className={styles.formPasswordGroup}>
                        <Label for="password">CONFIRME SUA SENHA</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={'password'}
                                value={confirmNewPassword}
                                onChange={(event) => {
                                    setConfirmNewPassword(event.target.value)
                                }}
                                required
                                placeholder="Confirme sua senha"
                                className={styles.input}
                            />
                    </FormGroup>
                    <Button type="submit" className={styles.submitButton}>Alterar senha</Button>
                    <ToastComponent color={color} isOpen={toastIsOpen} message={errorMessage} />
                </Form>
            </Container>
        </main>
    </>
}