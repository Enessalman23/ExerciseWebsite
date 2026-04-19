package BitirmeProjesi.example.Egzersiz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
		"BitirmeProjesi.example.Egzersiz",
		"config",
		"controller",
		"dto",
		"entity",
		"enums",
		"exception",
		"repository",
		"service",
		"util",
        "filter"

})
@EntityScan(basePackages = "entity")
@EnableJpaRepositories(basePackages = "repository")
public class EgzersizApplication {

	public static void main(String[] args) {
		SpringApplication.run(EgzersizApplication.class, args);
	}

}
