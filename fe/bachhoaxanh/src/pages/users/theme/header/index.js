import {AiOutlineFacebook, AiOutlineInstagram, AiOutlineLinkedin,
     AiOutlineTwitter, AiOutlineUser, AiOutlineMail, 
     AiOutlineShoppingCart} from "react-icons/ai";
import {memo, useState } from "react";
import { Link } from 'react-router-dom';
import "./style.scss";
import { formatter } from "utils/fomater";
import { ROUTERS } from "utils/router";
 const  Header = () => {
    const [menus, setMenus] = useState([
        {
            name: "Trang chủ",
            path: ROUTERS.USER.HOME,
        },
        {
            name: "Cửa hàng",
            path: ROUTERS.USER.PRODUCT,
        },
        {
            name: "Sản phẩm",
            path: "",
            isShowSubmenu: false,
            child: [
            {
                name: "Thịt",
                path: "",
            },
            {
                name: "Cá",
                path: "",
            },
            {
                name: "Rau củ",
                path: "",
            },
            {
                name: "Đồ khô",
                path: "",
            }
        ]
        },{
            name: "Bài viết",
            path: "",
        },{
            name: "Liên Hệ",
            path: "",
        },
    ]);

    return (
    <>
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
        <div className="container">
            <div className="row">
                <div className="col-xl-3 ">
                    <div className="header__logo">
                        <h1>BachhoaXANH</h1>
                    </div>
                </div>
                <div className="col-xl-6">
                    <nav className="header__menu">
                        <ul>
                            {
                                menus?.map((menu, menuKey) => (
                                    <li key={menuKey} className= {menuKey === 0 ? "active" : ""}>
                                        <Link to={menu?.path}>
                                            {menu?.name}
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </nav>
                </div>
                <div className="col-xl-3">
                    <div className="header__cart">
                        <div className="header__cart__price">
                            <span>{formatter(1000000)}</span>
                        </div>
                        <ul>
                            <li>
                                <Link to ="#">
                                    <AiOutlineShoppingCart /> <span> 5</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
    
};

export default memo(Header);