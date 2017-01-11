Simply add jQuery & boner.js file, and configure the options as follows:

<script type="text/javascript">
    $(document).ready( function() {
        $(".main").boner({
            shaftSize:  20,
            streamSize: 30,
            speed:      '50',
            message:    'this is a rocket ship',
            ballStyle:  'enhanced',
            shaftStyle: 'enhanced'
        });
    });
</script>
