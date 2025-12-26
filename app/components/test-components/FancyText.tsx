
interface FancyTextProps {
    title?: string;
    text?: string;
}

export default function FancyText({title, text}: FancyTextProps){
    return title
    ? <h1>{title}</h1>
    : <p>{text}</p>
}