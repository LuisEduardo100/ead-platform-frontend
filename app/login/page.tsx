'use client';
import { Container, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import Footer from '../../src/components/common/footer'
import HeaderGeneric from '../../src/components/common/headerGeneric'
import styles from '../styles/login.module.scss'
import { FormEvent, useEffect, useState } from 'react'
import ToastComponent from '../../src/components/common/toastComponent'
import { useRouter, useSearchParams } from 'next/navigation'
import authService from '../../src/services/authService'


const Login = function () {
    const router = useRouter()
    const params = useSearchParams()
    const [toastColor, setToastColor] = useState("");
    const [toastIsOpen, setToastIsOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");


    useEffect(()=>{
        if (sessionStorage.getItem("vocenotadez-token")){
            router.push("/home")
        }
    }, [])
    
    useEffect(()=>{
        const registerSuccess = params.get("success")
        if (registerSuccess === "true"){
            setToastColor("bg-success")
            setToastIsOpen(true)
            setTimeout(()=>{
                setToastIsOpen(false)
            }, 2500)

            setToastMessage("Cadastrado com sucesso")
        } 
    }, [params])

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")!.toString()
        const password = formData.get("password")!.toString()
        const params = {email, password}

        const { status } = await authService.login(params)

        if (status === 200) {
            router.push("/home")
        } else {
            setToastColor("bg-danger")
            setToastIsOpen(true)
            setTimeout(()=>{
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
                    <p className="text-center py-2"><strong>Crie a sua conta</strong></p>
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
                        <Label for="password">SENHA</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="Digite a sua senha"
                            className={styles.input}
                        />
                    </FormGroup>
                    <Button type="submit" className={styles.formBtn}>ENTRAR</Button>
                </Form>
            </Container>
            <Footer />
            <ToastComponent isOpen={toastIsOpen} color={toastColor} message={toastMessage}/>
        </main>

    </>)
}

export default Login