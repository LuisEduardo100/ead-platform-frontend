'use client';
import { Container, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import Footer from '../../src/components/common/footer'
import HeaderGeneric from '../../src/components/common/headerGeneric'
import styles from '../styles/login.module.scss'
import { FormEvent, useEffect, useState } from 'react'
import ToastComponent from '../../src/components/common/toastComponent'
import { useRouter, useSearchParams } from 'next/navigation'
import authService from '../../src/services/authService'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';


const Login = function () {
    const router = useRouter()
    const params = useSearchParams()
    const paramsUrl = useSearchParams()
    const [toastColor, setToastColor] = useState("");
    const [toastIsOpen, setToastIsOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible)
    }

    useEffect(() => {
        if (sessionStorage.getItem("vocenotadez-token")) {
            router.push("/home")
        }
    }, [])

    useEffect(() => {
        const registerSuccess = params.get("success")
        if (registerSuccess === "true") {
            setToastColor("bg-success")
            setToastIsOpen(true)
            setTimeout(() => {
                setToastIsOpen(false)
            }, 2500)

            setToastMessage("Cadastrado com sucesso")
        }
    }, [params])

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const registerSuccess = paramsUrl.get("newuserbuy")

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")!.toString()
        const password = formData.get("password")!.toString()
        const params = { email, password }

        const { status } = await authService.login(params)

        if (status === 200 && registerSuccess == 'true') {
            router.push("/precos")
        } else if (status === 200) {
            router.push("/home")
        } else {
            setToastColor("bg-danger")
            setToastIsOpen(true)
            setTimeout(() => {
                setToastIsOpen(false)
            }, 2500)

            setToastMessage("Email ou senha incorretos")
        }
    }
    return (<>
        <main className={styles.main}>
            <HeaderGeneric logoUrl="/" btnUrl="/register" btnContent="QUERO SER NOTA DEZ!" />
            <Container className={styles.container}>
                <p className={styles.formTitle}>Bem-vindo(a) ao Você Nota Dez!</p>
                <Form className={styles.form} onSubmit={handleLogin}>
                    <p className="text-center py-2"><strong>Faça seu login</strong></p>
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
                    <FormGroup className={styles.formPasswordGroup}>
                        <Label for="password">SENHA</Label>
                        <div className={styles.password_wrapper}>
                            <Input
                                id="password"
                                name="password"
                                type= {isPasswordVisible ? 'text' : 'password'}
                                required
                                placeholder="Digite a sua senha"
                                className={styles.input}
                                />
                                <span className={styles.visibility} onClick={togglePasswordVisibility}>
                                    {isPasswordVisible ? <VisibilityOff/> : <Visibility/>}
                                </span>
                        </div>
                        <Link href={'/resetPassword'} target="_blank" className={styles.forgotPassword}>Esqueceu sua senha?</Link>
                    </FormGroup>
                    <Button type="submit" className={styles.formBtn}>ENTRAR</Button>
                </Form>
            </Container>
            <Footer />
            <ToastComponent isOpen={toastIsOpen} color={toastColor} message={toastMessage} />
        </main>

    </>)
}

export default Login