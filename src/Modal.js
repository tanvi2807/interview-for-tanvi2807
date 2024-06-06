import ReactDOM from 'react-dom';
import Dashboard from './Dashboard';
import './Dashboard.css'; 

const Modal =  ({onClose,children}) => {
    return(
        ReactDOM.createPortal(
            <div>
                <div onClick= {onClose} className="parent"></div>
                <div className="chld">{children}</div>
            </div>,

            document.querySelector('.modal-container')
        )
    );
}

export default Modal;

