<template>
  <div>
    <n-config-provider inline-theme-disabled>
      <n-message-provider>
        <n-notification-provider>
          <n-loading-bar-provider>
            <n-dialog-provider>
              <slot />
            </n-dialog-provider>
          </n-loading-bar-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>
