import java.swing.*;

import javax.swing.JButton;
import javax.swing.JPanel;

import java.awt.*;

public class FenetreEx4 extends Frame{

	public FenetreEx4()
	{
		this.setSize(400, 300);
		this.setTitle("Ex4");

		JPanel panelOuiNon = new JPanel();
		JPanel panelDroit = new JPanel();


		JButton buttonOui = new JButton("Oui");
		JButton buttonNon = new JButton("Non");

		JButton button1 = new JButton("10");
		JButton button2 = new JButton("20");
		JButton button3 = new JButton("30");
		JButton button4 = new JButton("40");
		JButton button5 = new JButton("50");
		JButton button6 = new JButton("60");
		JButton button7 = new JButton("70");
		JButton button8 = new JButton("80");
		JButton button9 = new JButton("90");
		JButton button10 = new JButton("100");


		panelDroit.add(button1);






		panelOuiNon.add(buttonNon, BorderLayout.CENTER);
		panelOuiNon.add(buttonOui, BorderLayout.CENTER);
		panelOuiNon.setBackground(Color.black);

		buttonNon.setBackground(Color.RED);
		buttonOui.setBackground(Color.RED);

		this.add(panelOuiNon, BorderLayout.NORTH);
		this.setVisible(true);
	}



	public static void main(String[] args)
	{
		new FenetreEx4();
	}

}

