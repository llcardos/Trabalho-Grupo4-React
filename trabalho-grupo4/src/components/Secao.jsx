export default function Secao ({ titulo, children }) {
    return (
        <section className='secao'>
            <h2>{titulo}</h2>
            <div className='secao-cards'>
                {children}
            </div>
        </section>
    );
};