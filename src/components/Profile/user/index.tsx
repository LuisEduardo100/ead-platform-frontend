'use client';
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import styles from './styles.module.scss'
import { FormEvent, useEffect, useState } from "react";
import profileService from "../../../services/profileService";
import 'jsuites'
import ToastComponent from "../../common/toastComponent";
import { useRouter } from "next/navigation";

export default function UserForm() {
    const router = useRouter()
    const [color, setColor] = useState("");
    const [toastIsOpen, setToastIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [initialEmail, setInitialEmail] = useState("")
    const [createdAt, setCreatedAt] = useState("")

    const date = new Date(createdAt);
    const month = date.toLocaleDateString("pt-BR", { month: "long" });

    useEffect(() => {
        profileService.fetchCurrent().then((user) => {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setPhone(user.phone);
            setEmail(user.email);
            setInitialEmail(user.email);
            setCreatedAt(user.createdAt);
        })
    }, [])


    const handleUserUpdate = async function (event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const res = await profileService.userUpdate({
            firstName,
            lastName,
            phone,
            email,
            createdAt
        })

        if (res === 200 || res == 201) {
            setToastIsOpen(true);
            setErrorMessage("Informações alteradas com sucesso!");
            setColor("bg-success");
            setTimeout(() => setToastIsOpen(false), 2500);

            if (email != initialEmail){
                sessionStorage.clear()
                router.push("/")
            }
        } else {
            setToastIsOpen(true);
            setErrorMessage("Você não pode mudar para esse email!");
            setColor("bg-danger");
            setTimeout(() => setToastIsOpen(false), 2500);
        }
    }
    return (<>
        <Form className={styles.forms} onSubmit={(event) => handleUserUpdate(event)}>
            <div className={styles.formName}>
                <p className={styles.nameAbbreviation}>
                    {firstName.slice(0, 1)}
                    {lastName.slice(0, 1)}
                </p>
                <p className={styles.userName}>{`${firstName} ${lastName}`}</p>
            </div>
            <div className={styles.memberTime}>
                <img src="/favicon.png" alt="iconProfile" className={styles.memberTimeImg} />
                <p className={styles.memberTimeText}>Membro desde <br /> {`${date.getDate()} de ${month} de ${date.getFullYear()}`}</p>
            </div>

            <hr className={styles.hr} />
            <div className={styles.inputFlexDiv}>
                <FormGroup>
                    <Label className={styles.label} for="firstName">
                        NOME
                    </Label>
                    <Input
                        name="firstName"
                        type="text"
                        id="firstName"
                        placeholder="Qual o seu primeiro nome?"
                        required
                        maxLength={20}
                        className={styles.inputFlex}
                        value={firstName}
                        onChange={(event) => { setFirstName(event.target.value) }}
                    />
                </FormGroup>
                <FormGroup>
                    <Label className={styles.label} for="lastName">
                        SOBRENOME
                    </Label>
                    <Input
                        name="lastName"
                        type="text"
                        id="lastName"
                        placeholder="Qual o seu último nome?"
                        required
                        maxLength={20}
                        className={styles.inputFlex}
                        value={lastName}
                        onChange={(event) => { setLastName(event.target.value) }}
                    />
                </FormGroup>
            </div>
            <div className={styles.inputNormalDiv}>
                <FormGroup>
                    <Label className={styles.label} for="phone">
                        WHATSAPP / TELEGRAM
                    </Label>
                    <Input
                        name="phone"
                        type="tel"
                        id="phone"
                        placeholder="(xx) 9xxxx-xxxx"
                        data-mask="[-]+55 (00) 00000-0000"
                        required
                        className={styles.input}
                        value={phone}
                        onChange={(event) => { setPhone(event.target.value) }}
                    />
                </FormGroup>
                <FormGroup>
                    <Label className={styles.label} for="email">
                        E-MAIL
                    </Label>
                    <Input
                        name="email"
                        type="email"
                        id="email"
                        placeholder="Coloque o seu email"
                        required
                        className={styles.input}
                        value={email}
                        onChange={(event) => { setEmail(event.target.value) }}
                    />
                </FormGroup>

                <Button className={styles.formBtn} outline type="submit">
                    Salvar Alterações
                </Button>
                <ToastComponent color={color} isOpen={toastIsOpen} message={errorMessage} />
            </div>
        </Form>
    </>)
}