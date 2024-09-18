'use client';
import styles from '../styles/register.module.scss'
import HeaderGeneric from '../../src/components/common/headerGeneric'
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap'
import 'jsuites';
import Footer from '../../src/components/common/footer';
import { FormEvent, useEffect, useState } from 'react';
import authService from '../../src/services/authService';
import { useRouter, useSearchParams } from 'next/navigation';
import ToastComponent from '../../src/components/common/toastComponent';

const Register = function () {
    const router = useRouter();
    const paramsUrl = useSearchParams()
    const [toastIsOpen, setToastIsOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState("")

    useEffect(()=>{
        if (sessionStorage.getItem("vocenotadez-token")){
            router.push("/home")
        }
    }, [])

    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const firstName = formData.get("firstName")!.toString();
        const lastName = formData.get("lastName")!.toString();
        const phone = formData.get("phone")!.toString();
        const birth = formData.get("birth")!.toString();
        const email = formData.get("email")!.toString();
        const password = formData.get("password")!.toString();
        const confirmPassword = formData.get("confirmPassword")!.toString();
        const params = {firstName, lastName, phone, birth, email, password};

        if (password != confirmPassword) {
            setToastIsOpen(true);
            setTimeout(() => {
                setToastIsOpen(false);
            }, 2500);
            setToastMessage("Senha e confirmação diferentes.");

            return;
        }

        const { data, status } = await authService.register(params);

        
        if (status === 201 && paramsUrl.get('newuser') == 'true') {
            router.push('/login?newuserbuy=true')
        } else if(status==201) {
            router.push("/login?success=true");
        } else {
            setToastIsOpen(true);
            setTimeout(() => {
                setToastIsOpen(false);
            }, 2500);
            setToastMessage(data.message);
        }
    }

    return (
        <>
            <main className={styles.main}>
                <HeaderGeneric logoUrl='/' btnUrl='/login' btnContent='JÁ SOU NOTA DEZ' />
                <Container className="py-5">
                    <p className={styles.formTitle}>Bem-vindo(a) ao Você Nota Dez!</p>
                    <Form className={styles.form} onSubmit={handleRegister} >
                        <p className="text-center py-2"><strong>Crie a sua conta</strong> </p>
                        <FormGroup>
                            <Label for="firstName" className={styles.label}>NOME</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="Qual o seu nome?"
                                required
                                maxLength={20}
                                className={styles.inputName}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="lastName" className={styles.label}>SOBRENOME</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Qual o seu sobrenome?"
                                required
                                maxLength={20}
                                className={styles.inputName}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="phone" className={styles.label}>
                                WHATSAPP / TELEGRAM
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="(xx) 9xxxx-xxxx"
                                data-mask="[-]+55 (00) 00000-0000"
                                required
                                className={styles.input}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="email" className={styles.label}>E-MAIL</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Digite o seu e-mail"
                                required
                                className={styles.input}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="birth" className={styles.label}>
                                DATA DE NASCIMENTO
                            </Label>
                            <Input
                                id="birth"
                                name="birth"
                                type="date"
                                min="1930-01-01"
                                max="2024-12-31"
                                required
                                className={styles.input}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password" className={styles.label}>
                                SENHA
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Digite a sua senha (Min: 6 | Max: 20)"
                                required
                                minLength={6}
                                maxLength={20}
                                className={styles.input}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="confirmPassword" className={styles.label}>
                                CONFIRME SUA SENHA
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirme a sua senha"
                                required
                                minLength={6}
                                maxLength={20}
                                className={styles.input}
                            />
                        </FormGroup>
                        <Button type="submit" outline className={styles.formBtn}>
                            CADASTRAR
                        </Button>
                    </Form>
                </Container>
                <Footer />
                <ToastComponent color="bg-danger" isOpen={toastIsOpen} message={toastMessage} />
            </main>
        </>
    )
}
export default Register