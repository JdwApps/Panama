
const CategoHalf = ({ title, backgroundColor }) => {
    return (
        <div className="w-screen ">
            <div className={`w-full h-64 flex flex-col items-center justify-center ${backgroundColor}`}>
                <h1 className="text-3xl text-left text-white font-bold mb-4">{title}</h1>
            </div>

        </div>
    );
};

export default CategoHalf;
