'use client';
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import styles from './styles.module.scss'
import { FormEvent, useEffect, useState } from "react";
import profileService from "../../../services/profileService";
import 'jsuites'
import ToastComponent from "../../common/toastComponent";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BtnSpinner from "../../common/btnSpinner";

export default function UserForm() {
    const router = useRouter()
    const [color, setColor] = useState("");
    const [toastIsOpen, setToastIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [userStats, setUserStats] = useState(false)
    const [profilePicture, setProfilePicture] = useState(""); // Placeholder para a imagem
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [serie, setSerie] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [initialEmail, setInitialEmail] = useState("")
    const [createdAt, setCreatedAt] = useState("")
    const date = new Date(createdAt);
    const month = date.toLocaleDateString("pt-BR", { month: "long" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        profileService.fetchCurrent().then((user) => {
            setProfilePicture(user.profileImage)
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setPhone(user.phone);
            setSerie(user.serie)
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
            serie,
            phone,
            email,
            createdAt
        })

        if (res === 200 || res == 201) {
            setToastIsOpen(true);
            setErrorMessage("Informações alteradas com sucesso!");
            setColor("bg-success");
            setTimeout(() => setToastIsOpen(false), 2500);

            if (email != initialEmail) {
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return setToastIsOpen(true), setErrorMessage("Nenhum arquivo selecionado"), setColor("bg-danger"), setTimeout(() => setToastIsOpen(false), 2500), setLoading(false)
        
        setLoading(true);
    
        try {
          const uploadPromise = profileService.uploadProfilePicture(selectedFile);
          const delayPromise = new Promise(resolve => setTimeout(resolve, 1000));
          
          const [updatedUser] = await Promise.all([uploadPromise, delayPromise]);
    
          if (updatedUser) {
            setProfilePicture(updatedUser.profileImage);
            
            setToastIsOpen(true)
            setErrorMessage("Foto de perfil atualizada com sucesso")
            setColor("bg-success")
            setTimeout(() => setToastIsOpen(false), 2500);
          }
        } catch (error) {
            setToastIsOpen(true)
            setErrorMessage("Erro ao atualizar foto de perfil")
            setColor("bg-danger")
            setTimeout(() => setToastIsOpen(false), 2500);
        } finally {
          setLoading(false);
        }
      }

    return (<>
        <Form className={styles.forms} onSubmit={(event) => handleUserUpdate(event)}>
            <div className={styles.formName}>
                {profilePicture ?
                    (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_BASEURL}/${profilePicture}`}
                            alt="user picture"
                            width={150}
                            height={150}
                            style={{ borderRadius: '50%' }}
                        />
                    ) : (
                        <p className={styles.nameAbbreviation}>
                            {firstName.slice(0, 1)}
                            {lastName.slice(0, 1)}
                        </p>
                    )
                }
                {!userStats ? (
                    <span style={{
                        backgroundColor: '#e8ea5b',
                        padding: '2px 16px',
                        borderRadius: '20px',
                        fontSize: '0.8rem'
                    }}>PREMIUM</span>
                ) : (
                    <span style={{
                        backgroundColor: '#19b719',
                        padding: '2px 16px',
                        borderRadius: '20px',
                        fontSize: '0.8rem'
                    }}>FREE</span>

                )}
                <p className={styles.userName}>{`${firstName} ${lastName}`}</p>
            </div>
            <div className={styles.div_foto_perfil}>
                <p>UPLOAD SUA FOTO DE PERFIL</p>
                <div>
                    <Input className={styles.input_image} type="file" onChange={handleFileChange} disabled={loading} />
                    <Button className={styles.btn_upload_image} onClick={handleUpload} disabled={loading}>
                        {loading ? <BtnSpinner/> : 'Enviar Foto'}
                    </Button>
                </div>
            </div>
            <div className={styles.memberTime}>
                <img src="/logo-vocenotadez.png" alt="iconProfile" className={styles.memberTimeImg} />
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
                <FormGroup className={styles.selectWrapper}>
                    <Label for="serie" className={styles.selectLabel}>ESCOLHA SUA SÉRIE</Label>
                    <Input
                        type="select"
                        name="serie"
                        value={serie}
                        id="serie"
                        required
                        className={styles.selectInput}
                        onChange={(event) => { setSerie(event.target.value) }}
                    >
                        <option value="6º ano">6º ano</option>
                        <option value="7º ano">7º ano</option>
                        <option value="8º ano">8º ano</option>
                        <option value="9º ano">9º ano</option>
                    </Input>
                </FormGroup>
                <Button className={styles.formBtn} type="submit">
                    Salvar Alterações
                </Button>
                <ToastComponent color={color} isOpen={toastIsOpen} message={errorMessage} />
            </div>
        </Form>
    </>)
}