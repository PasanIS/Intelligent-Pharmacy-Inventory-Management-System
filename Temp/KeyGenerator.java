import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

public class KeyGenerator {
    public static void main(String[] args) {
        SecretKey key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
        String base64Key = Encoders.BASE64.encode(key.getEncoded());
        System.out.println("Copy this key for your application.properties file:");
        System.out.println(base64Key);
    }
}
