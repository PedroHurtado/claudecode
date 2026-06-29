import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public final class Producto {

    private final UUID id;
    private String name;
    private double cost;

    private final List<Object> domainEvents = new ArrayList<>();

    private Producto(UUID id, String name, double cost) {
        this.id = id;
        this.name = name;
        this.cost = cost;
    }

    public static Producto create(UUID id, String name, double cost) {
        Producto producto = new Producto(id, name, cost);
        producto.domainEvents.add(new ProductoCreated(id, name, cost));
        return producto;
    }

    public static Producto rehydrate(UUID id, String name, double cost) {
        return new Producto(id, name, cost);
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getCost() {
        return cost;
    }

    public List<Object> getDomainEvents() {
        return Collections.unmodifiableList(domainEvents);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Producto producto)) return false;
        return id.equals(producto.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public record ProductoCreated(UUID id, String name, double cost) {
    }
}
