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
import FooterAuth from '../../src/components/HomeAuth/footerAuth';


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
    }, [router])

    useEffect(() => {
        const registerSuccess = params.get("success")
        const access = params.get("access")
        
        if (access === "denied") {
            setToastColor("bg-danger")
            setToastIsOpen(true)
            setTimeout(() => {
                setToastIsOpen(false)
            }, 2500)
            setToastMessage("Faça o login para ter acesso gratuito")
        }
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

        try {
            const response = await authService.login(params);
    
            const { status, data } = response;
            
            if (status === 200) {
                if (registerSuccess === "true") {
                    router.push("/precos");
                } else {
                    router.push("/home");
                }
            } else if (status === 401) {
                if (data?.message?.toLowerCase().includes("confirme seu email para acessar a conta!")) {
                    setToastMessage("Acesso negado. Confirmação de email necessária.");
                } else {
                    setToastMessage("Email ou senha incorretos.");
                }
                setToastColor("bg-danger");
                setToastIsOpen(true);
                setTimeout(() => { 
                    setToastIsOpen(false);
                }, 2500);
            } else {
                setToastColor("bg-danger");
                setToastIsOpen(true);
                setToastMessage("Ocorreu um erro ao tentar fazer login.");
                setTimeout(() => {
                    setToastIsOpen(false);
                }, 2500);
            }
        } catch (error: any) {
            console.error("Login error:", error);
            setToastColor("bg-danger");
            setToastIsOpen(true);
            setToastMessage("Erro ao conectar ao servidor. Tente novamente.");
            setTimeout(() => {
                setToastIsOpen(false);
            }, 2500);
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
                                type={isPasswordVisible ? 'text' : 'password'}
                                required
                                placeholder="Digite a sua senha"
                                className={styles.input}
                            />
                            <span className={styles.visibility} onClick={togglePasswordVisibility}>
                                {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                            </span>
                        </div>
                        <Link href={'/resetPassword'} target="_blank" className={styles.forgotPassword}>Esqueceu sua senha?</Link>
                    </FormGroup>
                    <Button type="submit" className={styles.formBtn}>ENTRAR</Button>
                    <ToastComponent isOpen={toastIsOpen} color={toastColor} message={toastMessage} />
                </Form>
            </Container>
            <FooterAuth />
        </main>
    </>)
}

export default Login