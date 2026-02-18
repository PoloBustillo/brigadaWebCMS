# 🔧 Servicio de Quota - Documentación

## Descripción

El servicio de Quota permite obtener información en tiempo real sobre el uso de recursos de los servicios externos:

- **Render**: Hosting de la aplicación
- **Neon DB**: Base de datos PostgreSQL
- **Cloudinary**: Almacenamiento de imágenes (próximamente)

## 🚀 Configuración

### 1. Obtener las API Keys

#### Render
1. Ve a [https://render.com/account/api-tokens](https://render.com/account/api-tokens)
2. Crea un nuevo token API
3. Copia el token
4. Asigna a `NEXT_PUBLIC_RENDER_API_KEY`

#### Neon DB
1. Ve a [https://console.neon.tech/app/settings/api-keys](https://console.neon.tech/app/settings/api-keys)
2. Genera una nueva API Key
3. Obtén tu Project ID en [https://console.neon.tech](https://console.neon.tech)
4. Asigna:
   - `NEXT_PUBLIC_NEON_API_KEY`: tu API key
   - `NEXT_PUBLIC_NEON_PROJECT_ID`: tu Project ID

#### Cloudinary
1. Ve a [https://cloudinary.com/console](https://cloudinary.com/console)
2. Obtén tu Cloud Name
3. Ve a Settings > API Keys
4. Copia tu API Key y API Secret
5. Asigna:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: tu Cloud Name
   - `NEXT_PUBLIC_CLOUDINARY_API_KEY`: tu API Key
   - `CLOUDINARY_API_SECRET`: tu API Secret (variable privada, no expongas esta en el cliente)

### 2. Configurar Variables de Entorno

Copia el archivo `.env.quota.example` a `.env.local`:

```bash
cp .env.quota.example .env.local
```

Completa los valores de las API keys.

## 📍 Ubicación

El servicio se encuentra en **Configuración > Servicios**:

```
Dashboard > Configuración > [Tab] Servicios
```

## 📊 Información Mostrada

### Render
- Número total de servicios
- Servicios activos
- CPU total asignado (cores)
- Memoria total asignada (MB)
- Estado de cada servicio

### Neon DB
- Nombre del proyecto
- Número de branches
- Región
- Almacenamiento usado
- Tiempo de compute usado
- Cuotas disponibles

### Cloudinary
- Almacenamiento usado (en GB)
- Transferencia de datos (en GB)
- Número de assets
- Créditos utilizados
- Número de transformaciones

## 🔄 Actualización

El componente se actualiza automáticamente:
- **Al cargar**: Obtiene los datos al abrir la página
- **Cada 5 minutos**: Refresco automático
- **Manual**: Botón "Actualizar" para refrescar manualmente

## ⚠️ Manejo de Errores

Si algún servicio no está configurado correctamente:
- Se muestra un indicador rojo ❌
- Se muestra el mensaje de error específico
- Los otros servicios continúan funcionando

## 🔐 Consideraciones de Seguridad

⚠️ **IMPORTANTE**: 
- **NO expongas** variables privadas en el cliente
- `CLOUDINARY_API_SECRET` debe ser privada (sin `NEXT_PUBLIC_`)
- Usa environment variables en el servidor Node.js
- Las API keys deben estar protegidas en un `.env.local` local

## 🛠️ API de Servicio

### `quotaService.getAllQuotas()`
Obtiene información de todos los servicios.

```typescript
const allQuotas = await quotaService.getAllQuotas();
console.log(allQuotas.render);
console.log(allQuotas.neon);
console.log(allQuotas.cloudinary);
```

### `quotaService.getQuotaByService(service)`
Obtiene información de un servicio específico.

```typescript
const render = await quotaService.getQuotaByService('render');
const neon = await quotaService.getQuotaByService('neon');
const cloudinary = await quotaService.getQuotaByService('cloudinary');
```

### `quotaService.formatQuotaDisplay(quotaInfo)`
Formatea la información para mostrar.

```typescript
const rendered = quotaService.formatQuotaDisplay(quotaInfo);
console.log(rendered); // "Render: ✅ 3 servicios, 2 activos"
```

## 📚 Ejemplo de Uso

```typescript
import { quotaService } from "@/lib/api/quota.service";

// Obtener todas las quotas
const quotas = await quotaService.getAllQuotas();

if (quotas.render?.status === "success") {
  console.log(`Render: ${quotas.render.data.activeServices} servicios activos`);
}

if (quotas.neon?.status === "success") {
  console.log(`Neon: ${quotas.neon.data.branches} branches`);
}

if (quotas.cloudinary?.status === "success") {
  console.log(`Cloudinary: ${quotas.cloudinary.data.storageUsed.gb}GB`);
}
```

## 📱 Componente QuotaDisplay

Para usar el componente directamente:

```tsx
import { QuotaDisplay } from "@/components/quota/quota-display";

export default function MyPage() {
  return (
    <div>
      <QuotaDisplay />
    </div>
  );
}
```

El componente incluye:
- Carga automática de datos
- Refresco automático cada 5 minutos
- Botón de actualización manual
- Indicadores de estado (✅ / ❌)
- Manejo de errores
- Timestamp de última actualización

## 🔜 Próximas Mejoras

- [ ] Gráficos de tendencia histórica
- [ ] Alertas por límites de quota
- [ ] Exportar reportes de uso
- [ ] Integración con Stripe para facturación
- [ ] Predicciones de sobre-uso

## ❓ Preguntas Frecuentes

### P: ¿Por qué no puedo ver mis datos?
R: Verifica que las API keys estén correctamente configuradas y sean válidas.

### P: ¿Con qué frecuencia se actualizan los datos?
R: Se refrescan automáticamente cada 5 minutos, o manualmente con el botón de actualizar.

### P: ¿Qué hago si recibo un error?
R: Verifica el mensaje de error específico. Generalmente es por API keys inválidas o no configuradas.

### P: ¿Puedo ocultar el tab de Servicios?
R: Sí, elimina el botón del tab y el contenedor en `src/app/dashboard/settings/page.tsx`.
