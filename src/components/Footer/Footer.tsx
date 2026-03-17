import Image from "next/image";
import ampLogo from "../../../public/amp-footer-logo.svg";
import linkIcon from "../../../public/anchor-ico.svg";
import socialHandls from "../../../public/social-handels.svg";

import "./footer.css";

function Footer() {
  return (
    <footer id="site_footer">
      <div className="site_container">
        <div className="site_flex space_between footer_main">
          <div className="footer_left">
            <div className="footer_left-inner site_flex flex_column">
              <div className="footer_logo">
                <a href="">
                  <Image src={ampLogo} alt="AMP Media Logo" width={170} height={42} />
                </a>
              </div>
              <div className="footer_email">
                <h3>Talk to us</h3>
                <a href="mailto:info@theampmedia.com">
                  <span className="anchor_hover">info@theampmedia.com</span>
                  <span>
                    <Image src={linkIcon} alt="Email Link Icon" width={100} height={100} />
                   
                    <Image src={linkIcon} alt="Email Link Icon" width={100} height={100} />
                  </span>
                </a>
              </div>
              <p className="copyright_text">
                © {new Date().getFullYear()} AMPV Media Pvt. Ltd. All rights reserved.
              </p>
            </div>
          </div>
          <div className="footer_right">
            <div className="footer_right-inner">
              <div className="socical-media">
                
                <Image src={socialHandls} alt="Social Handles" width={156} height={36} />
              </div>
              <div className="footer_right-top">
                <h2>
                  <span className="gray">Not Big on Social.</span> Big on Real.
                </h2>
              </div>
              <div className="footer_right-bottom site_flex flex_column site_gap">
                <p>
                  We’re a little too shy (or just too busy building cool things)
                  to post every day.
                </p>
                <p>
                  But if you’re curious about what we do or how we work — come
                  by, grab a coffee, and chat with the team.
                </p>
                <p>
                  No filters. No fluff. Just honest conversations and good
                  vibes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
