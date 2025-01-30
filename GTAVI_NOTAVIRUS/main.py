from direct.showbase.ShowBase import ShowBase
from panda3d.core import WindowProperties, FrameBufferProperties, TextNode
from panda3d.core import Vec4

class TransparentWindow(ShowBase):
    def __init__(self):
        # Disable default window creation
        super().__init__(windowType='none')

        # Configure framebuffer for transparency
        fb_props = FrameBufferProperties()
        fb_props.set_alpha_bits(8)  # Enable alpha channel in framebuffer

        # Configure window properties
        wp = WindowProperties()
        wp.set_undecorated(True)    # Remove window decorations
        wp.set_size(400, 300)       # Set window size
        wp.set_origin(100, 100)     # Set window position

        # Open window with custom properties
        self.openDefaultWindow(props=wp, fbf=fb_props)

        # Set transparent background
        self.setBackgroundColor(Vec4(0, 0, 0, 0))  # RGBA (alpha=0)

        # Add text to verify visibility
        self.text = TextNode("transparent_text")
        self.text.setText("Transparent Window\n(Panda3D)")
        self.text.setTextColor(1, 1, 1, 1)  # White text
        text_node = self.aspect2d.attachNewNode(self.text)
        text_node.set_pos(-0.5, 0, 0.2)
        text_node.set_scale(0.1)

        # Disable default camera controls
        self.disableMouse()

# Run the application
app = TransparentWindow()
app.run()