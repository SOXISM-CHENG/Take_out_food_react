/*
 * @Author: mocheng
 */
import { KEYUTIL,KJUR,hextob64 } from 'common/md5.js';
//私钥
var privateKey="-----BEGIN PRIVATE KEY-----MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALp+nkNsb0dfqNq3TxQe53JNd/C3rRdoMG3l+n7CjTGA60y6O+ssZ/j5kzwFrVBaSwIkpBIX1j/NhOTf2s+ItwjU1dliKKD6Da4kBABaGJPwDSYZVo05PmaywRb11knijgXdIq4c/Yn4tIbagoE4pEkBWeKRe+EpUedsrn1mVh/lAgMBAAECgYB8zF58IAQXbxw/wItam5OmGdE5dLCQCVjfMhb+3JI/nlXXcojGR2EMa3bro6DnNIUdWgexU+I7r/xObL6wQny4d8UJNN6SWbLIxkb2YjoUk5SaBO7bqFlEiyWJN0cp21h9KQIwAlbHeGIpll5SIR5uMqx4gTXcIzOqtyz/xtSyAQJBANqHPN7R3Oe8ALmMBwIh7YmA9sL3osSu6zer6Wa0qBlntyuv+6eB1VvON8JlZOCFA3mJoRHvmKeq1JCiMEzhUjkCQQDaeTHL3NdbO1dYQgKhLwWV2JjpyskSF3xjlNNbS0e8nu0Vwn+f8GTba0tO/BeVkuaKLfX0NbhXt/2YYkdhQIsNAkBwdqkdA2Rs3pSA6U+yCUP2QCi+rjNWha8IN7Em6lKYwIfENA2PZ4ImfTq1EPmZktr28Z2zXVty7rf2t4GkD1IBAkB2P8LEJPQrXSMZkiD6PQk44dNiN3A9apjZDWSYtVZOsXaBoJSTbPoqCRjp12isfKZrhBTr6Wetktif8hHQga7BAkEAmhOwXzYFD1jqd+cvgh0ImdWBDfq2qrfqYFhne+o0iEzHxukOty+GLm/mmaAkb/VvLX75qf/zNMNrTk5ZwXgtBA==-----END PRIVATE KEY-----";
function doSign(content){
    var prvKey = KEYUTIL.getRSAKeyFromPlainPKCS8PEM(privateKey); // KEYUTIL提供了PKCS#8的pem读取，这是一般用openssl生成的默认。而jsrsasign的默认是PKCS#1 所以需要用keyutil
    var sig = new KJUR.crypto.Signature({"alg": "MD5withRSA", "prov": "cryptojs/jsrsa"}); // alg为MD5WithRSA，这个还有个常见的是SHA1WithRSA，不过貌似支付宝是用的MD5，所以我们公司用的也是MD5，也许java默认的就是这个格式。
    sig.initSign(prvKey);  // 设置key
    sig.signString(content);  // 签名
    //var sign = hex2b64(sig.hSign);  // 得到签名Hex，并转成base64string
    var sign=hextob64(sig.hSign);
    return sign
}
export default doSign;
