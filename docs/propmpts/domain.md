# Generar entidad de dominio (patrón DDD con factory methods)
Genera una entidad de dominio en **[LENGUAJE: C# / Java]** a partir de esta especificación:
- **Nombre de la entidad:** [NOMBRE]
- **Identidad (id):** [NOMBRE Y TIPO DEL ID]
- **Propiedades:** [LISTA: nombre, tipo, ¿mutable o no?]
- **Invariantes / reglas de negocio:** [OPCIONAL: validaciones, restricciones]
- **Comportamientos de mutación:** [OPCIONAL: métodos que cambian estado, p. ej. ChangeCost, Rename]
## Reglas de diseño obligatorias
0. **Versión de Java: 17 (LTS).** Cuando el lenguaje sea Java, genera el código apuntando a **Java 17** y usa de forma idiomática las características disponibles hasta esa versión, entre otras:
   - **Pattern matching for `instanceof`** (Java 16): en `equals` usa `if (!(o instanceof MiEntidad e)) return false;` en lugar de `getClass()`/cast explícito + comprobación de `null`.
   - **`record`** (Java 16) para los eventos de dominio y value objects.
   - **`var`** (Java 10) para inferencia de tipos en variables locales cuando mejore la legibilidad.
   - **Text blocks** (Java 15), **switch expressions** (Java 14) y **sealed classes/interfaces** (Java 17) donde aporten claridad.
   No utilices APIs ni sintaxis posteriores a Java 17 (p. ej. *record patterns* o *pattern matching for switch* definitivos de Java 21).
1. **Es una entity, no un value object.** La igualdad (Equals/GetHashCode en C#, equals/hashCode en Java) se basa **únicamente en el id**, nunca en el resto de propiedades. No usar record para entities.
2. **No asumas inmutabilidad.** Solo el id es inmutable (readonly/final). Las demás propiedades son mutables salvo que la especificación diga lo contrario. Exponer la mutación a través de métodos de comportamiento explícitos, no de setters públicos abiertos (en C#: private set; en Java: setter con nombre de método de negocio).
3. **Separa creación de rehidratación mediante dos factory methods estáticos:**
   - Create(...): nace una vez, ejecuta validaciones de invariantes y **emite el evento de dominio** [Entidad]Created. Acumula los eventos en una colección interna expuesta como solo lectura.
   - Rehydrate(...): reconstruye la entidad desde persistencia **sin emitir eventos**. Es la vía que usa el repositorio al recuperar de la BB.DD.
4. **El constructor es private** (no protected, salvo que se vaya a heredar para un ORM o jerarquía de agregado). Nadie puede instanciar la entidad fuera de los factory methods. La clase es sealed/final salvo que se indique herencia.
5. **Eventos de dominio:** colección interna privada, expuesta como solo lectura (IReadOnlyList en C#, copia inmutable en Java). Cada método de creación/mutación con relevancia de negocio añade su evento correspondiente.
## Pautas
- No añadas inmutabilidad, eventos ni comportamientos que no se deriven de la especificación o de estas reglas.
- Si la especificación describe en realidad un value object (sin identidad, igualdad por valor, inmutable), dilo y usa record en su lugar.
- Mantén el código mínimo: no metas dependencias, persistencia ni infraestructura dentro de la entidad.

Ciñete a lo que te estoy pasando no crees más de lo que te pido