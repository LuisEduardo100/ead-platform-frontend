'use client'
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";
import HeaderNoAuth from "../../src/components/HomeNoAuth/header";
import styles from '../styles/passwordReset.module.scss'
import { Email } from "@mui/icons-material";
import { FormEvent, useState } from "react";
import recoverPasswordEmail from "../../src/services/sendEmail";
import ToastComponent from "../../src/components/common/toastComponent";

export default function ResetPassword() {
    const [toastColor, setToastColor] = useState("");
    const [toastIsOpen, setToastIsOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const handleSendEmail = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")!.toString()

        const res = await recoverPasswordEmail(email); // Chamada para o serviço

        if (!res) {
            setToastIsOpen(true);
            setToastMessage("Tivemos um problema em processar as informações!");
            setToastColor("bg-danger");
            setTimeout(() => setToastIsOpen(false), 700 * 3);
            return;
        }
    
        setToastIsOpen(true);
        setToastMessage("Email enviado com sucesso!");
        setToastColor("bg-success");
        setTimeout(() => setToastIsOpen(false), 700 * 3);
        
        console.log(res);
    }
    return <>
        <main>
            <HeaderNoAuth />
            <Container className="pt-5">
                <Form className={styles.principal} onSubmit={handleSendEmail}>
                    <FormGroup>
                        <Label for='email'>Recupere sua senha</Label>
                        <div className={styles.emailWrrapper}>
                            <Email className={styles.emailIcon} fontSize="medium" />
                            <Input
                                id='email'
                                name='email'
                                type='email'
                                placeholder='Digite seu email da conta registrada'
                                required
                                className={styles.input}
                            />
                        </div>
                    </FormGroup>
                    <Button type="submit" className={styles.submitButton}>Enviar</Button>
                    <p className="text-center">Enviaremos um email com as instruções de recuperação.</p>
                    <ToastComponent isOpen={toastIsOpen} color={toastColor} message={toastMessage} />
                </Form>
            </Container>
        </main>
    </>
}