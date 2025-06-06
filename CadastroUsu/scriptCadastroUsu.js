// Modo escuro
const checkbox = document.getElementById('theme-toggle-checkbox');

function updateTheme(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

checkbox.addEventListener('change', () => {
  updateTheme(checkbox.checked);
});

updateTheme(false);

// Mostrar/ocultar senha
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'Ocultar';
  } else {
    input.type = 'password';
    btn.textContent = 'Mostrar';
  }
}

// Formatação telefone
const telefoneInput = document.querySelector('input[placeholder="Telefone"]');
telefoneInput.addEventListener('input', () => {
  let value = telefoneInput.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);

  if (value.length > 2) {
    value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
  }

  if (value.length > 9) {
    value = value.slice(0, 9) + '-' + value.slice(9);
  } else if (value.length > 8) {
    value = value.slice(0, 8) + '-' + value.slice(8);
  }

  telefoneInput.value = value;
});

// Formatação CEP
const cepInput = document.querySelector('input[placeholder="CEP"]');
cepInput.addEventListener('input', () => {
  let value = cepInput.value.replace(/\D/g, '');
  if (value.length > 8) value = value.slice(0, 8);
  if (value.length > 5) {
    value = value.slice(0, 5) + '-' + value.slice(5);
  }
  cepInput.value = value;
});

// Validação e mensagem para e-mail
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');

const validDomains = ['@gmail.com', '@hotmail.com', '@outlook.com', '@yahoo.com'];

emailInput.addEventListener('input', () => {
  const value = emailInput.value.trim().toLowerCase();
  const valid = validDomains.some(domain => value.endsWith(domain));

  if (value === '' || valid) {
    emailError.style.display = 'none';
    emailInput.style.boxShadow = '';
  } else {
    emailError.style.display = 'block';
    emailInput.style.boxShadow = '0 0 6px red';
  }
});

// Validação senhas
const senhaInput = document.getElementById('senha');
const confirmarSenhaInput = document.getElementById('confirmarSenha');
const senhaError = document.getElementById('senha-error');

function validarSenhas() {
  if (confirmarSenhaInput.value === '') {
    senhaError.style.display = 'none';
    confirmarSenhaInput.style.boxShadow = '';
    return;
  }
  if (senhaInput.value === confirmarSenhaInput.value) {
    senhaError.style.display = 'none';
    confirmarSenhaInput.style.boxShadow = '';
  } else {
    senhaError.style.display = 'block';
    confirmarSenhaInput.style.boxShadow = '0 0 6px red';
  }
}

senhaInput.addEventListener('input', validarSenhas);
confirmarSenhaInput.addEventListener('input', validarSenhas);

// Validação ao enviar o formulário (evitar submit com erro)
const form = document.querySelector('form');
form.addEventListener('submit', e => {
  // Valida email
  const emailValido = validDomains.some(domain => emailInput.value.trim().toLowerCase().endsWith(domain));
  // Valida senhas
  const senhasIguais = senhaInput.value === confirmarSenhaInput.value;

  if (!emailValido) {
    e.preventDefault();
    emailError.style.display = 'block';
    emailInput.style.boxShadow = '0 0 6px red';
    emailInput.focus();
  }

  if (!senhasIguais) {
    e.preventDefault();
    senhaError.style.display = 'block';
    confirmarSenhaInput.style.boxShadow = '0 0 6px red';
    confirmarSenhaInput.focus();
  }

  // Você pode adicionar outras validações aqui se quiser
});

telefoneInput.addEventListener('input', () => {
  let nums = telefoneInput.value.replace(/\D/g, '').slice(0, 11);

  if (nums.length > 10) {
    // Celular com 9 dígitos: (xx) xxxxx-xxxx
    telefoneInput.value = `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
  } else if (nums.length > 6) {
    // Telefone fixo: (xx) xxxx-xxxx
    telefoneInput.value = `(${nums.slice(0,2)}) ${nums.slice(2,6)}-${nums.slice(6)}`;
  } else if (nums.length > 2) {
    telefoneInput.value = `(${nums.slice(0,2)}) ${nums.slice(2)}`;
  } else if (nums.length > 0) {
    telefoneInput.value = `(${nums}`;
  } else {
    telefoneInput.value = '';
  }
});
