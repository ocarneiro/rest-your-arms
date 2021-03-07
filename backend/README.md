# Backend (Python)

Esta proposta de backend usa o framework bottle como servidor web simples para gerar endpoints que controlam servos.

No Arduino, deve ser instalado um código do Firmata para receber o controle do servo gerado pela aplicação. 
Para fazer isso, você pode usar a IDE padrão do Arduino e instalar o exemplo Firmata -> StandardFirmata.

Serão disponibilizados endpoints para o braço direito e esquerdo em que você deve informar a posição do servo, em graus.

Exemplo:

    http://localhost:8080/braco/80   # Faz com que o braço direito fique na posção 80 graus.
    
    
