'use client';
import styles from '../styles/register.module.scss'
import HeaderGeneric from '../../src/components/common/headerGeneric'
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap'
import 'jsuites';
import { FormEvent, useEffect, useState } from 'react';
import authService from '../../src/services/authService';
import { useRouter, useSearchParams } from 'next/navigation';
import ToastComponent from '../../src/components/common/toastComponent';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useMenu } from '../../src/components/common/menu/menuProvider';
import FooterAuth from '../../src/components/HomeAuth/footerAuth';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import BtnSpinner from '../../src/components/common/btnSpinner';

const validatePasswordStrength = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

const Register = function () {
    const router = useRouter();
    const paramsUrl = useSearchParams()
    const [loading, setLoading] = useState(false);
    const [toastIsOpen, setToastIsOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [color, setColor] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const { isMenuOpen } = useMenu()

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible)
    }

    useEffect(() => {
        if (sessionStorage.getItem("vocenotadez-token")) {
            router.push("/home")
        }
    }, [router])

    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formElement = event.currentTarget;
        setLoading(true);

        if (!(event.currentTarget instanceof HTMLFormElement)) {
            setToastIsOpen(true)
            setToastMessage("Erro no formulário de registro")
            setColor("bg-danger")
            setLoading(false)
            setTimeout(() => setToastIsOpen(false), 2500);
            return
        }

        if (!executeRecaptcha) {
            setToastIsOpen(true);
            setToastMessage("reCAPTCHA não está disponível no momento.");
            setColor("bg-danger");
            setTimeout(() => setToastIsOpen(false), 2500);
            setLoading(false);
            return
        }

        let recaptchaToken: string;
        try {
            recaptchaToken = await executeRecaptcha('register');
        } catch (error) {
            setToastIsOpen(true);
            setToastMessage("Falha ao executar reCAPTCHA.");
            setColor("bg-danger");
            setTimeout(() => setToastIsOpen(false), 2500);
            setLoading(false);
            return;
        }

        const formData = new FormData(formElement);

        if (!formData) {
            setToastIsOpen(true)
            setToastMessage("Dados do formulário inválidos")
            setColor("bg-danger")
            setLoading(false)
            return
        }

        const firstName = formData.get("firstName")!.toString();
        const lastName = formData.get("lastName")!.toString();
        const serie = formData.get("serie")!.toString();
        const phone = formData.get("phone")!.toString();
        const birth = formData.get("birth")!.toString();
        const email = formData.get("email")!.toString();

        if (!isValidEmail(email)) {
            setToastIsOpen(true);
            setToastMessage("Por favor, insira um email válido.");
            setColor("bg-danger");
            setLoading(false);
            return;
        }

        const password = formData.get("password")!.toString();
        const confirmPassword = formData.get("confirmPassword")!.toString();
        const params = { firstName, lastName, serie, phone, birth, email, password, token: recaptchaToken };

        if (password != confirmPassword) {
            setToastIsOpen(true);
            setTimeout(() => {
                setToastIsOpen(false);
            }, 2500);
            setToastMessage("Senha e confirmação diferentes.");

            return;
        }

        if (!validatePasswordStrength(password)) {
            setToastIsOpen(true);
            setToastMessage("A senha deve conter pelo menos 8 caracteres, incluindo letras, números e caracteres especiais (@, $, !, %¨, *, ?, &)");
            setColor("bg-danger");
            setTimeout(() => setToastIsOpen(false), 900 * 3);
            return
        }

        const { data, status } = await authService.register(params);

        if (status === 201 && paramsUrl.get('newuser') == 'true') {
            setToastIsOpen(true);
            setToastMessage("Cadastro realizado! Verifique seu email para confirmar a conta.");
            setColor("bg-success")
            setTimeout(() => {
                setToastIsOpen(false);
            }, 2500);
            setTimeout(() => router.push('/login?newuserbuy=true'), 3500)
        } else if (status == 201) {
            setToastIsOpen(true);
            setToastMessage("Cadastro realizado! Verifique seu email para confirmar a conta.");
            setColor("bg-success")
            setTimeout(() => {
                setToastIsOpen(false);
            }, 2500);
            setTimeout(() => router.push("/login?success=true"), 4000)
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
            <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ""}`}>
                <HeaderGeneric logoUrl='/' btnUrl='/login' btnContent='JÁ SOU NOTA DEZ' />
                <Container className="py-5">
                    <p className={styles.formTitle}>Bem-vindo(a) ao Você Nota Dez!</p>
                    <Form tag='form' className={styles.form} onSubmit={handleRegister} >
                        <p className="text-center py-2"><strong>Crie a sua conta</strong> </p>
                        <FormGroup>
                            <Label for="firstName" className={styles.label}>NOME</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="Qual o seu nome?"
                                required
                                maxLength={30}
                                className={styles.inputName}
                                autoComplete='first-name'
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
                                maxLength={30}
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
                                // minLength={6}
                                // maxLength={20}
                                className={styles.input}
                            />
                        </FormGroup>
                        <legend className={styles.label}>ESCOLHA SUA SÉRIE</legend>
                        <FormGroup className={styles.radioGroup} tag="fieldset">
                            <FormGroup check>
                                <Label className={styles.radioLabel} check>
                                    <Input
                                        type="radio"
                                        name="serie"
                                        value="6º ano"
                                        className={styles.radioInput}
                                        required
                                    />{' '}
                                    6º ano
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label className={styles.radioLabel} check>
                                    <Input
                                        type="radio"
                                        name="serie"
                                        value="7º ano"
                                        className={styles.radioInput}
                                        required
                                    />{' '}
                                    7º ano
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label className={styles.radioLabel} check>
                                    <Input
                                        type="radio"
                                        name="serie"
                                        value="8º ano"
                                        className={styles.radioInput}
                                        required
                                    />{' '}
                                    8º ano
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label className={styles.radioLabel} check>
                                    <Input
                                        type="radio"
                                        name="serie"
                                        className={styles.radioInput}
                                        value="9º ano"
                                        required
                                    />{' '}
                                    9º ano
                                </Label>
                                <Label className={styles.radioLabel} check>
                                    <Input
                                        type="radio"
                                        name="serie"
                                        className={styles.radioInput}
                                        value="1º ano"
                                        required
                                    />{' '}
                                    1º ano EM
                                </Label>
                                <Label className={styles.radioLabel} check>
                                    <Input
                                        type="radio"
                                        name="serie"
                                        className={styles.radioInput}
                                        value="2º ano"
                                        required
                                    />{' '}
                                    2º ano EM
                                </Label>
                                <Label className={styles.radioLabel} check>
                                    <Input
                                        type="radio"
                                        name="serie"
                                        className={styles.radioInput}
                                        value="3º ano"
                                        required
                                    />{' '}
                                    3º ano EM
                                </Label>
                            </FormGroup>
                        </FormGroup>
                        <Button type="submit" outline className={styles.formBtn}>
                            {loading ? <BtnSpinner /> : 'CADASTRAR'}
                        </Button>
                        <ToastComponent color={color} isOpen={toastIsOpen} message={toastMessage} />
                    </Form>
                </Container>
                <FooterAuth />
            </main>
        </>
    )
}
export default Register