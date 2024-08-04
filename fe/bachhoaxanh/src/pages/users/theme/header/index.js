import {AiOutlineFacebook, AiOutlineInstagram, AiOutlineLinkedin, AiOutlineTwitter, AiOutlineUser, AiOutlineMail} from "react-icons/ai";
import {memo } from "react";
import { Link } from 'react-router-dom';
import "./style.scss"
import { formatter } from "utils/fomater";
 const  Header = () => {
    return (
    <div className="header__top">
        <div className="container">
            <div className="row">
                <div className="col-6 header__top_left">
                    <ul>
                        <li>
                            <AiOutlineMail />
                            hello@gmail.com
                        </li>
                        <li>Miễn phí đơn từ {formatter(200000)}</li>
                    </ul>
                </div>
                <div className="col-6 header__top_right">
                    <ul>
                        <li>
                            <Link to={""}>
                                <AiOutlineFacebook />
                            </Link>
                        </li>
                        <li>
                            <Link to={""}>
                                <AiOutlineInstagram />
                            </Link>
                        </li>
                        <li>
                            <Link to={""}>
                                <AiOutlineLinkedin />
                            </Link>
                        </li>
                        <li>
                            <Link to={""}>
                                <AiOutlineTwitter />
                            </Link>
                        </li>
                        <li>
                            <Link to={""}>
                                <AiOutlineUser />
                            </Link>
                            <span>Đăng nhập</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    );
    
};

export default memo(Header);