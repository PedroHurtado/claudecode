import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public final class Persona {

    private final UUID id;
    private String name;
    private String sexo;
    private int edad;

    private final List<Object> domainEvents = new ArrayList<>();

    protected Persona(UUID id, String name, String sexo, int edad) {
        this.id = id;
        this.name = name;
        this.sexo = sexo;
        this.edad = edad;
    }

    public void update(String name, String sexo, int edad){
        this.name = name;
        this.sexo = sexo;
        this.edad = edad;
        this.domainEvents.add(new PersonaUpdated(id, name, sexo, edad));
    }
    public static Persona create(UUID id, String name, String sexo, int edad) {
        Persona persona = new Persona(id, name, sexo, edad);
        persona.domainEvents.add(new PersonaCreated(id, name, sexo, edad));
        return persona;
    }   

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSexo() {
        return sexo;
    }

    public int getEdad() {
        return edad;
    }

    public List<Object> getDomainEvents() {
        return Collections.unmodifiableList(domainEvents);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Persona persona)) return false;
        return id.equals(persona.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public record PersonaCreated(UUID id, String name, String sexo, int edad) {
    }

    public record PersonaUpdated(UUID id, String name, String sexo, int edad) {
    }
}
